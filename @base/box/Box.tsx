/**
 * @author    : izzetseydaoglu
 * @copyright : sydSOFT Bilişim Hizmetleri (c) 2026
 * @version   : 2026-02-19 23:44:42
 */

import React, { memo, useEffect, useRef, useState } from 'react';

import './Box.module.css';

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
        const found = boxRef.current.querySelector('.sbox_content');
        setHasContent(!!found);
    }, [children]);

    return (
        <div ref={boxRef} className={`sbox ${className || ''}`} style={style}>
            {(hasContent && children) || <div className="sbox_content">{children}</div>}

            {loading && (
                <div className="sbox_loading">
                    <div className="sbox_loading_spinner" />
                </div>
            )}
        </div>
    );
});
