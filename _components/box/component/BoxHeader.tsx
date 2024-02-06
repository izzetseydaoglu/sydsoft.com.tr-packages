/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 6.02.2024 23:45
 */

import React, {memo, ReactNode} from "react";

interface Props {
    className?: string,
    title?: string | ReactNode,
    icon?: ReactNode,
    menu?: ReactNode,
    mainStyle?: React.CSSProperties,
    iconStyle?: React.CSSProperties,
    titleStyle?: React.CSSProperties,
    menuStyle?: React.CSSProperties,
    component?: any,
    marginBottom?: number,
}

export const BoxHeader = memo(function FunctionMemo({className, title, icon, menu, mainStyle, iconStyle, titleStyle, menuStyle, marginBottom, component = "div"}: Props) {
    const Comp = component;
    return <Comp
        data-component={component}
        className={className ? "sbox_header " + className : "sbox_header"}
        style={{
            marginBottom,
            ...mainStyle,
        }}
    >
        {icon && <div className={"icon"} style={iconStyle}>{icon}</div>}
        {title && <div className={"title"} style={titleStyle}>{title}</div>}
        {menu && <div className={"menu"} style={menuStyle}>{menu}</div>}
    </Comp>;
})


