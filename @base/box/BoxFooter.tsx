/**
 * @author    : izzetseydaoglu
 * @copyright : sydSOFT Bilişim Hizmetleri (c) 2026
 * @version   : 2026-02-10 20:23:07
 */

import React, { memo } from "react";

import styles from "./Box.module.css";

interface Props {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    marginTop?: number;
    align?: "flex-start" | "center" | "flex-end" | "stretch";
}

export const BoxFooter = memo(function FunctionMemo({ children, className, style, align, marginTop }: Props) {
    return (
        <div
            className={`sbox_footer ${styles.footer} ${className || ""}`}
            style={{
                marginTop,
                justifyContent: align,
                ...style
            }}>
            {children}
        </div>
    );
});
