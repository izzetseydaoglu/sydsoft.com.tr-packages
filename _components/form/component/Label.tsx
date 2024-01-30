/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 30.01.2024 04:13
 */

import React, {memo} from "react";
import styled from "styled-components";
import {Tooltip} from "@sydsoft.com.tr/tooltip";

interface Props {
    children: React.ReactNode,
    required?: boolean
}

export const Label: React.FC<Props> = memo(function FMemo(props) {
    const {required, children, ...other} = props;
    return <MainBase {...other}>
        {children}
        <Tooltip title={"Zorunlu Alan"}><span className={"required"}>{required && "*"}</span></Tooltip>
    </MainBase>;
})
Label.defaultProps = {
    required: false
};

const MainBase = styled.label`
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: flex-end;
    text-align: right;
    color: inherit;
    display: inline-flex;
    flex: 1;
    padding-right: 5px;

    @media (max-width: 960px) {
        justify-content: flex-start !important;
        margin-bottom: 10px;
        padding-left: 5px;
        text-align: left;
    }

    .required {
        content: " ";
        width: 10px;
        color: #dc160f;
        margin-left: 3px;
        font-size: small;
        vertical-align: super;
        padding: 0 3px;
        cursor: pointer;
    }
`;