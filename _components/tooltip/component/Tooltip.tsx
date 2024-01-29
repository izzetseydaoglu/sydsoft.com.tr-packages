/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 29.01.2024 04:09
 */
import React, {memo, ReactElement, useEffect} from "react";

export type typeTooltipPosition = "top" | "bottom" | "left" | "right";

interface Props {
    children: ReactElement;
    title: string;
    position?: typeTooltipPosition;
    arrow?: boolean;
    distance?: number;
}

export const Tooltip = memo(function MemoFunction({children, title, position = "top", arrow = false, distance = 5, ...other}: Props) {
    useEffect((): any => {
        if (typeof window === "undefined") return null;
        const cssCheck = document.getElementsByClassName("stooltip_css")[0];
        if (!cssCheck) {
            const head = document.getElementsByTagName('head')[0];
            const s = document.createElement('style');
            s.setAttribute('type', 'text/css');
            s.classList.add("stooltip_css");
            s.appendChild(document.createTextNode(tooltipCss));
            head.appendChild(s);
        }
        return () => tooltipSil();
    }, [])

    const tooltipEkle = (e: any) => {
        tooltipSil();
        const tooltip = document.createElement("div");
        tooltip.innerHTML = title;
        tooltip.classList.add("stooltip");
        document.body.appendChild(tooltip);
        tooltipPosition({target: e.currentTarget, position: position});
    }

    const tooltipSil = () => {
        const check = document.body.getElementsByClassName("stooltip")[0];
        if (check) check.remove();
    }

    const tooltipPosition = ({target, position}: { target: HTMLElement, position: typeTooltipPosition }) => {
        const tooltip = document.body.getElementsByClassName("stooltip")[0];
        if (tooltip) {

            const arrowMargin = (arrow) ? 5 : 0;
            const margin = distance + arrowMargin;

            if (arrow) tooltip.classList.add("arrow");

            const targetPosition = target.getBoundingClientRect();
            const tooltipPosition = tooltip.getBoundingClientRect();

            const style = [];

            if (position === "top" || position === "bottom") {
                if (position === "top") {
                    if ((targetPosition.top - tooltipPosition.height - margin) < 0) {
                        style.push("top:" + (targetPosition.bottom + margin) + "px");
                        tooltip.classList.add("bottom");
                    } else {
                        style.push("top:" + (targetPosition.top - tooltipPosition.height - margin) + "px");
                        tooltip.classList.add("top");
                    }
                }
                if (position === "bottom") {
                    if ((targetPosition.bottom + tooltipPosition.height + margin) > window.innerHeight) {
                        style.push("top:" + (targetPosition.top - tooltipPosition.height - margin) + "px");
                        tooltip.classList.add("top");
                    } else {
                        style.push("top:" + (targetPosition.bottom + margin) + "px");
                        tooltip.classList.add("bottom");
                    }
                }
                // if ((targetPosition.left - tooltipPosition.width) < 0) {
                if ((targetPosition.left + (targetPosition.width / 2) - (tooltipPosition.width / 2)) < 0) {
                    style.push("left:2px");
                    tooltip.classList.add("start");
                } else if ((targetPosition.left + (targetPosition.width / 2) + tooltipPosition.width) > window.innerWidth) {
                    style.push("right:2px");
                    tooltip.classList.add("end");
                } else {
                    style.push("left:" + (targetPosition.left + (targetPosition.width / 2)) + "px");
                    style.push("transform:translate(-50%,0)");
                    tooltip.classList.add("center");
                }
            }

            if (position === "left" || position === "right") {
                if (position === "left") {
                    if ((targetPosition.left - tooltipPosition.width - margin) < 0) {
                        style.push("left:" + (targetPosition.right + margin) + "px");
                        tooltip.classList.add("right");
                    } else {
                        style.push("left:" + (targetPosition.left - tooltipPosition.width - margin) + "px");
                        tooltip.classList.add("left");
                    }
                }
                if (position === "right") {
                    if ((targetPosition.left + (targetPosition.width / 2) + tooltipPosition.width + margin) > window.innerWidth) {
                        style.push("left:" + (targetPosition.left - tooltipPosition.width - margin) + "px");
                        tooltip.classList.add("left");
                    } else {
                        style.push("left:" + (targetPosition.right + margin) + "px");
                        tooltip.classList.add("right");
                    }
                }

                if ((targetPosition.top + (targetPosition.height / 2) - (tooltipPosition.height / 2)) < 0) {
                    style.push("top:2px");
                    tooltip.classList.add("start");
                } else if ((targetPosition.top + (targetPosition.height / 2) + (tooltipPosition.height / 2)) > window.innerHeight) {
                    style.push("bottom:2px");
                    tooltip.classList.add("end");
                } else {
                    style.push("top:" + (targetPosition.top + (targetPosition.height / 2)) + "px");
                    style.push("transform:translate(0,-50%)");
                    tooltip.classList.add("center");
                }
            }

            tooltip.setAttribute("style", style.join(";"));
        }
    }

    return React.cloneElement(children, {
        onMouseEnter: tooltipEkle,
        onMouseLeave: tooltipSil,
        onMouseDown: tooltipSil,
        ...other
    });
})


const tooltipCss = `
.stooltip {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #1a1a1a;
    color: rgba(255,255,255,0.9);
    text-align: center;
    font-size: 0.9rem;
    font-weight:400;
    padding: 5px 10px;
    border-radius: 8px;
    z-index: 1000000;
    opacity: 0.9;
    pointer-events: none;
    /*transition: all 0.1s;*/
    white-space:pre-line;
    max-width: 300px;
    animation: stooltip_fadein 0.7s;
}

.stooltip.arrow:after {
    content: "";
    position: absolute;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
}

.stooltip.arrow.top:after {
    top: 100%;
    border-color: #1a1a1a transparent transparent transparent;
}

.stooltip.arrow.top.start:after { left: 15px;}

.stooltip.arrow.top.center:after { left: 50%;}

.stooltip.arrow.top.end:after { right: 15px;}


.stooltip.arrow.bottom:after {
    bottom: 100%;
    border-color: transparent transparent #1a1a1a transparent;
}

.stooltip.arrow.bottom.start:after { left: 15px;}

.stooltip.arrow.bottom.center:after { left: 50%;}

.stooltip.bottom.end:after { right: 15px;}

.stooltip.arrow.left:after {
    margin-left: -1px;
    left: 100%;
    border-color: transparent transparent transparent #1a1a1a;
}

.stooltip.arrow.left.start:after { top: 5px;}

.stooltip.arrow.left.center:after { top: 50%; margin-top: -5px;}

.stooltip.arrow.left.end:after { bottom: 15px;}

.stooltip.arrow.right:after {
    margin-right: -1px;
    right: 100%;
    border-color: transparent #1a1a1a transparent transparent;
}

.stooltip.arrow.right.start:after { top: 5px;}

.stooltip.arrow.right.center:after { top: 50%; margin-top: -5px;}

.stooltip.arrow.right.end:after { bottom: 15px;}

@keyframes stooltip_fadein {
    from { opacity: 0; }
    to   { opacity: 0.85; }
}
`;