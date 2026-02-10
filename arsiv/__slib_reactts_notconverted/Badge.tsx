/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 29.01.2024 04:09
 */

import React from "react";
import styled from "styled-components";

interface Props {
    badge: string | number | undefined,
    children: React.ReactNode,
    className?: string,
    style?: React.CSSProperties,
}

export const Badge: React.FC<Props> = React.memo(({children, badge, className, style}) => {
    return <MainBase
        className={className ? "badge " + className : "badge"}
        style={style}
        data-badge={badge}
        badge={badge}>
        {children}
        <span className={"badge"}>{badge}</span>
    </MainBase>;
})

const MainBase = styled.div<Props>`
  position: relative;

  .badge {
    position: absolute;
    top: 0;
    right: 0;
    min-width: 17px;
    height: 17px;
    background: #e41e3f;
    border-radius: 100px;
    font-size: .7rem;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 1px 3px;
    color: #fff;
    text-align: center;
    line-height: 100%;
    cursor: default;
    pointer-events: none;
  }

  &:not([data-badge]) .badge,
  &[data-badge="0"] .badge {
    display: none;
  }

`;