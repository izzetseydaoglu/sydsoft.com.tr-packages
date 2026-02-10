/**
 * @author    : izzetseydaoglu
 * @copyright : sydSOFT Bilişim Hizmetleri (c) 2026
 * @version   : 2026-02-10 20:26:27
 */

import React, { memo, useEffect, useRef, useState } from "react";

import ReactDOM from "react-dom";
import styles from "./index.module.css";

interface Props {
    children: React.ReactNode;
    open: boolean;
    close?: Function;
    keepMounted?: boolean;
    hideBackdrop?: boolean;
    hideEsc?: boolean;
    hideCloseButton?: boolean;
    fullScreen?: boolean;
    modalStyle?: React.CSSProperties;
    backdropStyle?: React.CSSProperties;
    vertialAlign?: "flex-start" | "center" | "flex-end";
    horizontalAlign?: "flex-start" | "center" | "flex-end";
    refModal?: any;
}

export const Modal = memo(function MemoFunction({
    refModal = null,
    children,
    open = false,
    close,
    keepMounted = false,
    fullScreen = false,
    hideBackdrop = true,
    hideEsc = false,
    hideCloseButton = false,
    modalStyle,
    backdropStyle,
    vertialAlign = "center",
    horizontalAlign = "center"
}: Props) {
    const [modalDiv, setModalDiv] = useState<HTMLElement | null>(null);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (refModal) refModal.current = ref.current;
    }, [ref.current]);

    const onClose = () => {
        if (close) close();
    };
    const checkHideBackDrop = (e: any) => {
        if (open && ref.current && !ref.current.contains(e.target)) onClose();
    };
    const checkESC = (e: any) => {
        if (e.keyCode === 27 || e.key === "Escape" || e.code === "Escape") onClose();
    };

    useEffect((): any => {
        if (open) {
            if (hideBackdrop) window.addEventListener("mousedown", checkHideBackDrop);
            if (hideEsc) window.addEventListener("keydown", checkESC);
        }

        return () => {
            if (hideBackdrop) window.removeEventListener("mousedown", checkHideBackDrop);
            if (hideEsc) window.removeEventListener("keydown", checkESC);
        };
    });

    useEffect(() => {
        if (!modalDiv) {
            const modalDivCheck = document.getElementById("smodal");
            if (modalDivCheck) {
                setModalDiv(modalDivCheck);
            } else {
                const div = document.createElement("div");
                div.setAttribute("id", "smodal");
                document.body.appendChild(div);
                setModalDiv(div);
            }
        }
        return () => {
            onClose();
        };
    }, []);

    if ((!keepMounted && !open) || typeof window === "undefined") return null;

    const Component = (
        <div className={`${styles.backdrop} ${open ? styles.backdrop_open : ""}`} style={{ alignItems: vertialAlign, justifyContent: horizontalAlign, ...backdropStyle }}>
            <div ref={ref} className={`smodal ${styles.modal} ${fullScreen ? styles.fullscreen : ""}`} style={modalStyle}>
                {!hideCloseButton && (
                    <div className={`close ${styles.close_fixed}`}>
                        <div className={styles.close} onClick={onClose}>
                            ✕
                        </div>
                    </div>
                )}
                {children}
            </div>
        </div>
    );

    return modalDiv ? ReactDOM.createPortal(Component, modalDiv) : null;
});
