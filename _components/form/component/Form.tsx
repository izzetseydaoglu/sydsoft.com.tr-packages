/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 30.01.2024 04:13
 */

import React, {FormEventHandler, memo} from "react";

interface Props {
    children?: React.ReactNode,
    onSubmit?: FormEventHandler<HTMLFormElement>,
    style?: React.CSSProperties,
    disableOnEnterSubmit?: boolean,
}

export const Form = memo(function FunctionMemo({onSubmit, style, disableOnEnterSubmit = false, ...other}: Props) {
    const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === "Enter" && disableOnEnterSubmit) {
            e.preventDefault();
        }
    }

    return <form style={style}
                 encType="multipart/form-data"
                 onSubmit={onSubmit}
                 onKeyDown={onKeyDown}
                 {...other}
    />;
})
