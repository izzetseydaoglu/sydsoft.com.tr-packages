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
