/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 29.01.2024 04:09
 */

import React, {useEffect, useState} from "react";
import styled from "styled-components";

type Props = {
    children: any,
    style?: React.CSSProperties,
    labelTable?: boolean,
    colorTable?: boolean,
}


export const TableSabit = ({children, style, labelTable = true, colorTable = true}: Props) => {
    const [classes, setClasses] = useState<string[]>([]);

    useEffect(() => {
        const classList: string[] = [];
        if (labelTable) classList.push("label-table");
        if (colorTable) classList.push("color-table");
        setClasses(classList);
    }, [])

    return (
        <MainBase className={classes.join(" ")} style={style}>
            {children}
        </MainBase>
    );
};


const MainBase = styled.div`
  table {
    width: 100%;
  }

  td {
    padding: 5px;
  }

  &.label-table tbody > tr > td:first-child {
    padding: 5px 10px;
    width: 35%;
    font-weight: 500;
    vertical-align: top;
    text-align: right;
  }
  &.color-table tbody > tr:nth-child(odd) { background: #f3f3f3;}

  &.color-table tbody > tr:nth-child(even) {background: #fff}
`;