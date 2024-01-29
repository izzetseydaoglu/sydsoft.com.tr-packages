/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 29.01.2024 04:09
 */
import React, {useEffect, useRef, useState} from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import Tooltip from "../../_components/tooltip/component/Tooltip";


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


const Modal: React.FC<Props> = React.memo((props) => {
    const {
        refModal = null, children, open, close,
        keepMounted, fullScreen, hideBackdrop, hideEsc, hideCloseButton,
        modalStyle, backdropStyle, vertialAlign, horizontalAlign
    } = props;

    if (typeof window === "undefined") return null;

    const [modalDiv, setModalDiv] = useState<HTMLElement | null>(null);

    const ref = refModal || useRef<HTMLDivElement | null>(null);

    const onClose = () => {
        if (close) close();
    }

    const checkHideBackDrop = (e: any) => {
        if (open && ref.current && !ref.current.contains(e.target)) onClose();
    }
    const checkESC = (e: any) => {
        if (e.keyCode === 27 || e.key === "Escape" || e.code === "Escape") onClose();
    }

    useEffect((): any => {
        if (open) {
            if (hideBackdrop) window.addEventListener("mousedown", checkHideBackDrop)
            if (hideEsc) window.addEventListener("keydown", checkESC)
        }

        return () => {
            if (hideBackdrop) window.removeEventListener("mousedown", checkHideBackDrop);
            if (hideEsc) window.removeEventListener("keydown", checkESC);
        }
    })

    useEffect(() => {
        if (!modalDiv) {
            const modalDivCheck = document.getElementById("smodal");
            if (modalDivCheck) {
                setModalDiv(modalDivCheck);
            } else {
                const div = document.createElement('div');
                div.setAttribute("id", "smodal");
                document.body.appendChild(div);
                setModalDiv(div);
            }
        }
        return () => {
            onClose();
        }
    }, [])

    if (!keepMounted && !open) return null;

    const Component = <MainBase style={{
        alignItems: vertialAlign,
        justifyContent: horizontalAlign,
        ...backdropStyle
    }} open={open} fullScreen={fullScreen}>
        <div ref={ref} className={"modal"} style={modalStyle}>
            {(!hideCloseButton) && (
                <Tooltip title={"Kapat"} position={"left"} distance={(fullScreen) ? 50 : 30}>
                    <div className={"close_fixed"}>
                        <div className={"close"} onClick={onClose}>✕</div>
                    </div>
                </Tooltip>
            )}
            {children}
        </div>
    </MainBase>;

    return (modalDiv) ? ReactDOM.createPortal(Component, modalDiv) : null;
})
Modal.defaultProps = {
    open: false,
    keepMounted: false,
    fullScreen: false,
    hideBackdrop: true,
    hideEsc: true,
    hideCloseButton: false,
    vertialAlign: "center",
    horizontalAlign: "center"
};
export default Modal;

const MainBase = styled.div<Props>`
  position: fixed;
  z-index: 1300;
  inset: 0;
  display: ${({open}) => (open) ? "flex" : "none"};
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.23);
  width: 100%;
  height: 100%;
  outline: none;

  .modal {
    position: relative;
    min-width: 200px;
    //max-width: 750px;
    max-width: 90%;
    max-height: calc(100% - 64px);
    overflow-x: hidden;
    border-radius: 8px;
    background: transparent;
    box-shadow: rgb(0 0 0 / 32%) 0 4px 8px, rgb(0 0 0 / 40%) 0 8px 40px;
    margin: 15px;
    padding: 0;
    z-index: 1;
    outline: none;

    ${({fullScreen}) => fullScreen && `
        max-width: 100%;
        width: 100%;
        height: 100%;
        margin: 0;
        max-height: 100%;
        border-radius: 0;
    `}
  }

  .close_fixed {
    position: absolute;
    top: 0;
    right: 1px;
    z-index: 1000;
    text-align: right;
    border-radius: inherit;

    .close {
      position: fixed;
      //top: 0;
      //right: 0;
      background: #e7e7e7;
      padding: 0 7px;
      font-size: 11px;
      transform: translateX(-100%);
      border-radius: inherit;
      border-top-left-radius: 0;
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 50%;
      cursor: pointer;

      &:hover {
        zoom: 1.3;
      }
    }
  }

  .sbox_header {
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .sbox_footer {
    position: sticky;
    bottom: 0;
    z-index: 10;
  }
`;
