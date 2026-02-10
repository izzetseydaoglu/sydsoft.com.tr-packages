/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 29.01.2024 04:09
 */

import React, {useEffect, useImperativeHandle, useState} from "react";
import styled from "styled-components";

type Props = {
    status?: boolean,
    children: any,
    style?: React.CSSProperties,
}
type collapseHandle = {
    open: () => void;
    close: () => void;
};


const Collapse: React.ForwardRefRenderFunction<collapseHandle, Props> = ({status = false, style, children, ...other}, forwardedRef) => {
    const [open, setOpen] = useState<boolean>(status);
    useEffect(() => setOpen(status), [status])

    useImperativeHandle(forwardedRef, () => ({
        open: () => {
            setOpen(true);
        },
        close: () => {
            setOpen(false);
        }
    }));


    return <MainBase
        className={open ? "open" : "close"}
        style={style}
        {...other}
    >
        {children}
    </MainBase>
};

export default React.forwardRef(Collapse);


const MainBase = styled.div`
  position: relative;
  width: 100%;

  &.close {
    max-height: 0;
    overflow: hidden;
  }

  &.open {
    max-height: unset;
  }
`;