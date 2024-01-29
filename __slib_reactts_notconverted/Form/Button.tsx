/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 29.01.2024 04:09
 */

import React, {memo, useEffect, useState} from 'react'
import styled from 'styled-components'
import Tooltip, {typeTooltipPosition} from "../../_components/tooltip/component/Tooltip";
import {propsDialog, sDialog} from "../Dialog";
import Link from "next/link";

interface Props {
    children?: React.ReactNode
    onlyIcon?: any
    buttonClass?: | 'default' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link'
    autoFocus?: boolean
    hidden?: boolean
    component?: 'button' | 'a' | any
    className?: string
    type?: 'submit' | 'reset' | 'button'
    disabled?: boolean
    fullWidth?: boolean
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
    href?: string | undefined
    target?: string | undefined
    style?: React.CSSProperties
    tabIndex?: number,

    //Tooltip
    title?: string
    titlePosition?: typeTooltipPosition,
    titleArrow?: boolean,

    //Dialog
    dialog?: propsDialog
}


export const Button = memo(function MemoFunction({
    children,
    component = 'button',
    className,
    buttonClass = 'default',
    style,
    type = 'button',
    fullWidth = false,
    onlyIcon,
    onClick,
    href,
    target,
    tabIndex,
    title,
    titlePosition,
    titleArrow,
    dialog,
    autoFocus,
    ...other
}: Props) {
    const ripple = (e: any): void => {
        const el = e.currentTarget
        const circle = document.createElement('span')
        const diameter = Math.max(el.clientWidth, el.clientHeight)
        circle.style.width = circle.style.height = `${diameter}px`
        circle.classList.add('ripple')
        const ripple = el.getElementsByClassName('ripple')[0]
        if (ripple) ripple.remove()
        el.appendChild(circle)
    }

    const handleClick = (e: any) => {
        ripple(e)
        if (dialog) {
            sDialog(dialog).then(result => {
                if (result && onClick) {
                    onClick(e)
                }
            });
        } else {
            if (onClick) onClick(e)
        }
    }


    const createClassList = () => {
        const list = ['sbutton'];
        if (className) list.push(className);
        if (buttonClass) list.push(buttonClass);
        if (onlyIcon) list.push('onlyicon');
        return list.join(' ')
    }

    const [classList, setClassList] = useState<string>(createClassList());
    useEffect(() => {
        const newClassList = createClassList().split(' ');
        if (href && typeof window !== "undefined" && new URL(window.location.href).pathname == href) {
            newClassList.push('active');
        }
        setClassList(newClassList.join(' '));
    }, [href, className, buttonClass, onlyIcon])

    const ortakProps = {
        className: classList,
        style,
        onClick: handleClick,
        // onlyIcon,
        $fullWidth: fullWidth,
        // href,
        tabIndex,
        autoFocus,
        ...other,
    }
    let renderComponent;
    if (href !== undefined) {
        if (other?.hidden) {
            renderComponent = null;
        } else {
            let checkHref = (other?.disabled) ? "#" : href;
            renderComponent = (
                <Link href={checkHref} target={(other?.disabled) ? "_self" : target}>
                    <MainBase component={"div"} {...ortakProps}>{onlyIcon ? onlyIcon : children}</MainBase>
                </Link>
            )
        }
    } else {
        renderComponent = (
            <MainBase component={component} type={type} {...ortakProps}>
                {onlyIcon ? onlyIcon : children}
            </MainBase>
        )
    }

    if (title && renderComponent) {
        return (
            <Tooltip title={title} position={titlePosition} arrow={titleArrow}>
                {renderComponent}
            </Tooltip>
        )
    } else {
        return renderComponent
    }
});


const MainBase = styled.div.attrs<any>(({component}: Props) => ({as: component || 'button'}))<Props>`
    width: ${({$fullWidth}) => ($fullWidth ? '100%' : 'unset')};
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    appearance: none;
    user-select: none;
    box-sizing: border-box;
    overflow: hidden;
    text-decoration: none;
    letter-spacing: 0.03em;
    text-transform: none;
    border-radius: 6px;
    color: rgba(0, 0, 0, 0.87);
    font-family: inherit;
    font-size: 13px;
    line-height: inherit;
    box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
    background-color: #e0e0e0;
    padding: 4px 10px;
    outline: 0;
    border: 0;
    cursor: pointer;
    white-space: nowrap;

    &[hidden] {
        display: none
    }

    &[disabled] {
        opacity: 0.7;
        box-shadow: inset 0 0 20px #000000ad;
        cursor: not-allowed;
    }

    &.onlyicon {
        padding: 8px;
        border-radius: 50%;
        background-color: transparent;
        box-shadow: none;
        color: #707274;
        overflow: unset;

        &:focus, &:hover {
            background-color: rgba(0, 0, 0, 0.04);
        }
    }

    &:focus,
    &:hover {
        opacity: 0.9;
    }

    .ripple {
        content: '';
        position: absolute;
        width: ${(ripple_width) => ripple_width + 'px'};
        height: ${(ripple_width) => ripple_width + 'px'};
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 600ms linear;
        background-color: rgba(255, 255, 255, 0.7);

        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    }

    &.primary {
        color: #fff;
        background-color: #3772c4;
        border-color: #1877f2;
    }

    &.secondary {
        color: #fff;
        background-color: #6c7573;
        border-color: #6c757d;
    }

    &.success {
        color: #fff;
        background-color: #198754;
        border-color: #198754;
    }

    &.danger {
        color: #fff;
        background-color: #dc3545;
        border-color: #dc3545;
    }

    &.warning {
        color: #000;
        background-color: #ffc107;
        border-color: #ffc107;
    }

    &.info {
        color: #000;
        background-color: #0dcaf0;
        border-color: #0dcaf0;
    }

    &.light {
        color: #000;
        background-color: #f8f9fa;
        border-color: #f8f9fa;
    }

    &.dark {
        color: #fff;
        background-color: #212529;
        border-color: #212529;
    }

    &.link {
        box-shadow: none;
        background-color: transparent;
        color: inherit;
    }
`
