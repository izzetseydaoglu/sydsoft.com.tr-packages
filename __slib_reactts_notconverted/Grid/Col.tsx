/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 29.01.2024 04:09
 */

import React from "react";
import styled from "styled-components";
import {Breakpoints} from "./Breakpoints";

type gridValues = "auto" | "full" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | string | number;

interface Props {
    children?: any,
    className?: string,
    style?: React.CSSProperties,
    xs?: gridValues
    sm?: gridValues
    md?: gridValues
    lg?: gridValues
    xl?: gridValues
    xxl?: gridValues
}

export const Col: React.FC<Props> = React.memo(({children, className, style, xs, sm, md, lg, xl, xxl}) => {
    let renderOlcek: { xxl: number | string; xl: number | string; lg: number | string; md: number | string; sm: number | string; xs: number | string; };
    renderOlcek = {xs: 12, sm: 12, md: 12, lg: 12, xl: 12, xxl: 12};
    renderOlcek.xxl = xxl || xl || lg || md || sm || xs || 12;
    renderOlcek.xl = xl || lg || md || sm || xs || 12;
    renderOlcek.lg = lg || md || sm || xs || 12;
    renderOlcek.md = md || sm || xs || 12;
    renderOlcek.sm = sm || xs || 12;
    renderOlcek.xs = xs || 12;


    return <MainBase
        className={className ? "col " + className : "col"}
        style={style}
        {...renderOlcek}
    >
        {children}
    </MainBase>;
})


const calcColResponsive = (val: any) => {
    if (val === "auto") {
        return `
        flex-basis:0 0 auto;
        width:auto;   
        max-width:none;   
      `;
    }
    if (val === "full") {
        return `
        flex-basis:0px;
        flex-grow:1;   
        max-width:100%;   
      `;
    }
    if (parseInt(val) > 0) {
        return `
        flex-basis:${((parseInt(val) * 100) / 12) + "%"};
        flex-grow:0;   
        max-width:${((parseInt(val) * 100) / 12) + "%"};   
      `;
    }
}

const MainBase = styled.div<Props>`
  position: relative;
  width: auto;
  box-sizing: border-box;
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: auto;

  // @DIKKAT - Burada sıralama önemli, geniş ekrandan başlayıp aşağı doğru yazılır.
  ${Breakpoints.xxl} {
    ${(props) => calcColResponsive(props.xxl)}
  }

  ${Breakpoints.xl} {
    ${(props) => calcColResponsive(props.xl)}
  }

  ${Breakpoints.lg} {
    ${(props) => calcColResponsive(props.lg)}
  }

  ${Breakpoints.md} {
    ${(props) => calcColResponsive(props.md)}
  }

  ${Breakpoints.sm} {
    ${(props) => calcColResponsive(props.sm)}
  }

  ${Breakpoints.xs} {
    ${(props) => calcColResponsive(props.xs)}
  }
`;