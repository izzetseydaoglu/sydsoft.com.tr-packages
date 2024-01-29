/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 29.01.2024 04:09
 */

import React, {FormEventHandler} from "react";

interface Props {
    children?: React.ReactNode,
    onSubmit?: FormEventHandler<HTMLFormElement>,
    style?: React.CSSProperties,
    disableOnEnterSubmit?: boolean,
}

export const Form: React.FC<Props> = React.memo(({onSubmit, style, disableOnEnterSubmit = false, ...other}) => {
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
