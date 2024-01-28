import React, {memo, ReactNode} from "react";
import styled from "styled-components";

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
    return <MainBase
        component={component}
        className={className ? "sbox_header " + className : "sbox_header"}
        style={{
            marginBottom,
            ...mainStyle,
        }}
    >
        {icon && <div className={"icon"} style={iconStyle}>{icon}</div>}
        {title && <div className={"title"} style={titleStyle}>{title}</div>}
        {menu && <div className={"menu"} style={menuStyle}>{menu}</div>}
    </MainBase>;
})


const MainBase = styled.div.attrs(({component}: Props) => ({as: component ? component : "div"}))<Props>`
    position: relative;
    min-width: 100%;
    //min-height: 50px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin: 10px 0 5px 0;
    padding: 5px 15px;

    & > .icon {
        display: inline-flex;
        align-items: center;
        flex: 0 0 auto;
        text-align: center;
        margin-right: 5px;
    }

    & > .title {
        flex: 1;
        font-size: 15px;
        font-weight: 500;
        line-height: 1;
        padding: 10px 0;
    }

    & > .menu {
        display: inline-flex;
        flex: 0 0 auto;
        align-items: center;
        justify-content: center;
        margin-left: 5px;
        margin-right: -10px;

        & > * {
            margin: 0 3px;
        }
    }
`;