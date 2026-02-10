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
