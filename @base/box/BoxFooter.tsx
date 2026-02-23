/**
 * @author    : izzetseydaoglu
 * @copyright : sydSOFT Bilişim Hizmetleri (c) 2026
 * @version   : 2026-02-19 23:44:31
 */

import React, { memo } from 'react';

import './Box.module.css';

interface Props {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    marginTop?: number;
    align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
}

export const BoxFooter = memo(function FunctionMemo({ children, className, style, align, marginTop }: Props) {
    return (
        <div
            className={`sbox_footer ${className || ''}`}
            style={{
                marginTop,
                justifyContent: align,
                ...style
            }}
        >
            {children}
        </div>
    );
});
