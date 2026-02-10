/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 29.01.2024 04:09
 */

import Link from "next/link";
import React from "react";
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


export const Menu: React.FC<Props> = React.memo(({menu, className, style, withIcon = true}) => {
    return <MainBase
        className={className ? "smenu " + className : "smenu"}
        style={style}
    >
        {menu.map(({icon, title, onClick, seperator, href, style, ...other}: typeMenu, key: React.Key) => {
            if (seperator) return <li key={key} className={"seperator"}/>
            const component = <li key={key} style={style} onClick={onClick} {...other}>
                {(withIcon) && <div className={"icon"}>{icon}</div>}
                <div className={"title"}>{title}</div>
            </li>;
            if (href) return <Link key={key} href={href} {...other}><a>{component}</a></Link>
            return component;
        })}
    </MainBase>;
})

const MainBase = styled.ul`
  position: relative;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 2px 4px rgb(0 0 0 / 10%), 0 8px 16px rgb(0 0 0 / 10%);
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
      margin-top: 5px
    }

    &:last-child {
      margin-bottom: 5px
    }

    &:hover {
      background: #f0f2f5;
    }

    .icon {
      display: inline-flex;
      overflow: hidden;
      width: 35px;
      flex: 0 0 auto;
      align-items: center;
      justify-content: center;
      margin-right: 5px;
      color: #606060;
    }

    .title {
      display: inline-flex;
      flex: 1;
      align-items: center;
      justify-content: flex-start;
    }
  }
`;