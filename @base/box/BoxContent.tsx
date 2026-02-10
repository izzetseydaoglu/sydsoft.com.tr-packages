/**
 * @author    : izzetseydaoglu
 * @copyright : sydSOFT Bilişim Hizmetleri (c) 2026
 * @version   : 2026-02-10 20:23:07
 */

import React, { ReactNode } from "react";

import styles from "./Box.module.css";

interface Props {
    className?: string;
    style?: React.CSSProperties;
    padding?: number;
    children?: ReactNode;
}

export const BoxContent = ({ className, style, padding, children }: Props) => {
    return (
        <div className={`${styles.content} sbox_content ${className || ""}`} style={{ ...style, padding }}>
            {children}
        </div>
    );
};
