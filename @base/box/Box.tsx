/**
 * @author    : izzetseydaoglu
 * @copyright : sydSOFT Bilişim Hizmetleri (c) 2026
 * @version   : 2026-02-10 20:23:07
 */

import React, { memo, useEffect, useRef, useState } from "react";

import styles from "./Box.module.css";

type Props = {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    loading?: boolean;
};

export const Box = memo(function MemoFunction({ children, className, style, loading = false }: Props) {
    const boxRef = useRef<HTMLDivElement>(null);

    const [hasContent, setHasContent] = useState(false);
    useEffect(() => {
        if (!boxRef.current) return;
        const found = boxRef.current.querySelector(".sbox_content");
        setHasContent(!!found);
    }, [children]);

    return (
        <div ref={boxRef} className={`sbox ${styles.sbox} ${className || ""}`} style={style}>
            {(hasContent && children) || <div className={styles.content}>{children}</div>}

            {loading && (
                <div className={styles.loading}>
                    <div className={styles.loading_spinner} />
                </div>
            )}
        </div>
    );
});
