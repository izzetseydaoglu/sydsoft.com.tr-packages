/**
 * @author    : izzetseydaoglu
 * @copyright : sydSOFT Bilişim Hizmetleri (c) 2026
 * @version   : 2026-02-10 20:23:07
 */

import React, { FormEventHandler, memo } from "react";

interface Props {
    children?: React.ReactNode;
    encType?: React.FormHTMLAttributes<HTMLFormElement>["encType"];
    onSubmit?: FormEventHandler<HTMLFormElement>;
    style?: React.CSSProperties;
    disableOnEnterSubmit?: boolean;
}

export const Form = memo(function FunctionMemo({ encType = "multipart/form-data", onSubmit, style, disableOnEnterSubmit = false, ...other }: Props) {
    const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === "Enter" && disableOnEnterSubmit) {
            e.preventDefault();
        }
    };

    return <form style={style} encType={encType} onSubmit={onSubmit} onKeyDown={onKeyDown} {...other} />;
});
