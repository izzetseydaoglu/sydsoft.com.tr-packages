/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 29.01.2024 19:41
 */

import React, {memo, useEffect} from "react";
import {BreakpointsValues} from "./Breakpoints";

interface Props {
    children?: any,
    hidden?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl"
    onlyHidden?: string[]
}

export const Hidden = memo(function MemoFunction({children, hidden, onlyHidden}: Props) {
    useEffect((): void => {
        if (typeof window === "undefined") return;
        const cssCheck = document.getElementsByClassName("shidden_css")[0];
        if (!cssCheck) {
            const head = document.getElementsByTagName('head')[0];
            const s = document.createElement('style');
            s.setAttribute('type', 'text/css');
            s.classList.add("shidden_css");
            s.appendChild(document.createTextNode(shidden_css));
            head.appendChild(s);
        }
    }, [])

    const {className} = children.props;
    let classList = (className) ? className.split(" ") : [];

    if (onlyHidden) {
        onlyHidden.map((hidden: string) => {
            classList.push("shidden-" + hidden)
        })
    } else {
        if (hidden === "xs") classList.push("shidden-xs");
        if (hidden === "sm") classList.push("shidden-xs", "shidden-sm");
        if (hidden === "md") classList.push("shidden-xs", "shidden-sm", "shidden-md");
        if (hidden === "lg") classList.push("shidden-xs", "shidden-sm", "shidden-md", "shidden-lg");
        if (hidden === "xl") classList.push("shidden-xs", "shidden-sm", "shidden-md", "shidden-lg", "shidden-xl");
        if (hidden === "xxl") classList.push("shidden-xs", "shidden-sm", "shidden-md", "shidden-lg", "shidden-xl", "shidden-xxl");
    }

    return React.cloneElement(children, {className: classList.join(" ")});
});

const shidden_css = `
@media only screen and (max-width: ${BreakpointsValues.xs}px) {
    .shidden-xs { display: none !important; }
}
@media only screen and (min-width:${BreakpointsValues.xs + 1}px) and (max-width:${BreakpointsValues.sm}px) {
    .shidden-sm { display: none !important;}
}
@media only screen and (min-width:${BreakpointsValues.sm + 1}px) and (max-width:${BreakpointsValues.md}px) {
    .shidden-md { display: none !important;}
}
@media only screen and (min-width:${BreakpointsValues.md + 1}px) and (max-width:${BreakpointsValues.lg}px) {
    .shidden-lg { display: none !important;}
}
@media only screen and (min-width:${BreakpointsValues.lg + 1}px) and (max-width:${BreakpointsValues.xl}px) {
    .shidden-xl { display: none !important;}
}
@media only screen and (min-width:${BreakpointsValues.xxl}px) {
    .shidden-xxl { display: none !important;}
}
`;