import React, { ReactNode, memo } from "react";

import styles from "./Box.module.css";

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

export const BoxHeader = memo(function FunctionMemo({ children, className, title, icon, menu, mainStyle, iconStyle, titleStyle, menuStyle, marginBottom, component = "div" }: Props) {
    const Comp = component;
    return (
        <Comp
            className={`sbox_header ${styles.header} ${className || ""}`}
            style={{
                marginBottom,
                ...mainStyle
            }}>
            {icon && (
                <div className={styles.icon} style={iconStyle}>
                    {icon}
                </div>
            )}

            <div className={styles.title} style={titleStyle}>
                {children || title}
            </div>

            {menu && (
                <div className={styles.menu} style={menuStyle}>
                    {menu}
                </div>
            )}
        </Comp>
    );
});
