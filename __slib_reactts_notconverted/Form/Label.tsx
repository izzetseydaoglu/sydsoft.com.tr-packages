/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 29.01.2024 04:09
 */

import React from "react";
import styled from "styled-components";
import Tooltip from "../../_components/tooltip/component/Tooltip";

interface Props {
    children: React.ReactNode,
    required?: boolean
}

export const Label: React.FC<Props> = React.memo((props) => {
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