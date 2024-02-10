/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 10.02.2024 06:07
 */

import Link from "next/link";
import React, {memo} from "react";
import styled from "styled-components";


export type typeMenu = {
    title?: string,
    icon?: any,
    onClick?: any,
    href?: string,
    seperator?: boolean,
    style?: React.CSSProperties,
    [key: string | number]: any;
};

interface Props {
    menu: typeMenu,
    className?: string,
    style?: React.CSSProperties,
    withIcon?: boolean
}

export const Menu = memo(function MemoFunction({menu, className, style, withIcon = true}: Props) {
    return <MainBase
        className={className ? "smenu " + className : "smenu"}
        style={style}
    >
        {
            Object.values(menu).map((item: typeMenu, key: number) => {
                const {icon, title, onClick, seperator, href, style, ...other} = item;
                if (seperator) return <li key={key} className={"seperator"}/>
                const Component = <li key={key} style={style} onClick={onClick} {...other}>
                    {(withIcon) && <div className={"menuicon"}>{icon}</div>}
                    <div className={"menutitle"}>{title}</div>
                </li>;
                if (href) return <Link key={key} href={href} {...other}><a>{Component}</a></Link>
                return Component;
            })
        }
    </MainBase>;
});


const MainBase = styled.ul`
    position: relative;
    width: 100%;
    background-color: #fff;
    box-shadow: 0 2px 4px rgb(0 0 0 / 40%), 0 8px 16px rgb(0 0 0 / 10%);
    border-radius: 8px;
    margin: 0;
    padding: 0;
    list-style: none;

    li {
        cursor: pointer;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        padding: 7px 15px;

        &.seperator {
            display: block;
            border-bottom: 1px #ced0d4 solid;
            margin: 4px;
            padding: 0;
            cursor: default;
        }

        &:first-child {
            margin-top: 5px;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }

        &:last-child {
            margin-bottom: 5px;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
        }

        &:hover {
            background: #f0f2f5;
        }

        .menuicon {
            display: inline-flex;
            overflow: hidden;
            width: 35px;
            flex: 0 0 auto;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            color: #606060;
        }

        .menutitle {
            display: inline-flex;
            flex: 1;
            align-items: center;
            justify-content: flex-start;
            margin-right: 10px;
        }
    }
`;