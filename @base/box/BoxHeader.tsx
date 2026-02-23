/**
 * @author    : izzetseydaoglu
 * @copyright : sydSOFT Bilişim Hizmetleri (c) 2026
 * @version   : 2026-02-19 23:44:23
 */

import React, { ReactNode, memo } from 'react';

import './Box.module.css';

interface Props {
    children?: ReactNode;
    className?: string;
    title?: string | ReactNode;
    icon?: ReactNode;
    menu?: ReactNode;
    mainStyle?: React.CSSProperties;
    iconStyle?: React.CSSProperties;
    titleStyle?: React.CSSProperties;
    menuStyle?: React.CSSProperties;
    component?: any;
    marginBottom?: number;
}

export const BoxHeader = memo(function FunctionMemo({ children, className, title, icon, menu, mainStyle, iconStyle, titleStyle, menuStyle, marginBottom, component = 'div' }: Props) {
    const Comp = component;
    return (
        <div
            className={`sbox_header ${className || ''}`}
            style={{
                marginBottom,
                ...mainStyle
            }}
        >
            {icon && (
                <div className="sbox_icon" style={iconStyle}>
                    {icon}
                </div>
            )}

            <Comp className="sbox_title" style={titleStyle}>
                {children || title}
            </Comp>

            {menu && (
                <div className="sbox_menu" style={menuStyle}>
                    {menu}
                </div>
            )}
        </div>
    );
});
