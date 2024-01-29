/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 29.01.2024 04:09
 */

import React, {memo} from "react";
import styled from "styled-components";

export type SpacingValues = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

interface Props {
    children: React.ReactNode,
    className?: string,
    style?: React.CSSProperties,
    flexDirection?: "row" | "row-reverse" | "column" | "column-reverse",
    flexWrap?: "wrap" | "wrap-reverse" | "nowrap",
    justifyContent?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly",
    alignContent?: "flex-start" | "center" | "flex-end" | "stretch" | "baseline",
    rowSpacing?: SpacingValues,
    colSpacing?: SpacingValues,
}


export const Row = memo(function MemoFunction({
    children,
    className,
    style,
    rowSpacing = 2,
    colSpacing = 2,
    flexDirection = "row",
    flexWrap = "wrap",
    justifyContent = "flex-start",
    alignContent = "center",
}: Props) {
    return <MainBase
        className={(className) ? "row " + className : "row"}
        $rowSpacing={rowSpacing}
        $colSpacing={colSpacing}
        style={{
            justifyContent: justifyContent,
            alignContent: alignContent,
            flexDirection: flexDirection,
            flexWrap: flexWrap,
            ...style,
        }}>
        {children}
    </MainBase>;
});


const MainBase = styled.div<any>`
    display: flex;
    box-sizing: border-box;
    margin-top: ${props => props.$rowSpacing ? -((props.$rowSpacing * 8)) : 0}px;
    margin-bottom: ${props => props.$rowSpacing ? ((props.$rowSpacing * 8)) : 0}px;
    width: calc(100% + ${props => props.$colSpacing ? ((props.$colSpacing * 8)) : 0}px);
    margin-left: ${props => props.$colSpacing ? -((props.$colSpacing * 8)) : 0}px;

    .col {
        padding-top: ${props => props.$rowSpacing ? ((props.$rowSpacing * 8)) : 0}px;
        padding-left: ${props => props.$colSpacing ? ((props.$colSpacing * 8)) : 0}px;
    }
`;