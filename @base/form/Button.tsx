import { Dialog, propsDialog } from "./Dialog";
import React, { memo, useCallback, useEffect, useState } from "react";
import { Tooltip, typeTooltipPosition } from "../tooltip";

import Link from "next/link";
import styles from "./styles/Button.module.css";

interface Props {
    children?: React.ReactNode;
    onlyIcon?: React.ReactNode;
    buttonClass?: "default" | "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark" | "link";
    buttonSize?: "small" | "medium" | "large";
    autoFocus?: boolean;
    hidden?: boolean;
    component?: "button" | "a" | "div" | any;
    className?: string;
    type?: "submit" | "reset" | "button";
    disabled?: boolean;
    fullWidth?: boolean;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    href?: string | undefined;
    target?: string | undefined;
    style?: React.CSSProperties;
    tabIndex?: number;

    //Tooltip
    title?: string;
    titlePosition?: typeTooltipPosition;
    titleArrow?: boolean;

    //Dialog
    dialog?: propsDialog;
}

export const Button = memo(function MemoFunction({
    children,
    component = "button",
    className,
    buttonClass = "default",
    buttonSize = "medium",
    style,
    type = "button",
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
    const Comp = component;
    const ripple = (e: any): void => {
        const el = e.currentTarget;
        const circle = document.createElement("span");
        const diameter = Math.max(el.clientWidth, el.clientHeight);
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.classList.add(styles.ripple);
        const ripple = el.getElementsByClassName(styles.ripple)[0];
        if (ripple) ripple.remove();
        el.appendChild(circle);
    };

    const handleClick = (e: any) => {
        ripple(e);
        if (dialog) {
            Dialog(dialog).then((result) => {
                if (result && onClick) {
                    onClick(e);
                }
            });
        } else {
            if (onClick) onClick(e);
        }
    };

    const createClassList = useCallback(() => {
        const list = ["sbutton", styles.button];
        if (buttonClass) list.push(styles[buttonClass]);
        if (className) list.push(className);
        if (onlyIcon) list.push(styles.iconbutton);
        if (fullWidth) list.push(styles.fullwidth);
        return list.join(" ");
    }, [buttonClass, className, onlyIcon, fullWidth]);

    const [classList, setClassList] = useState<string>(() => createClassList());

    useEffect(() => {
        const newClassList = createClassList().split(" ").filter(Boolean);
        if (href && typeof window !== "undefined" && window.location.pathname === href) {
            newClassList.push("active");
        }
        setClassList(newClassList.join(" "));
    }, [href, createClassList]);

    let ortakProps = {
        className: classList,
        style,
        onClick: handleClick,
        tabIndex,
        autoFocus,
        "data-button-size": (!onlyIcon)? buttonSize :null,
        ...other
    };

     



    let renderComponent;
    if (href !== undefined) {
        if (other?.hidden) {
            renderComponent = null;
        } else {
            let checkHref = other?.disabled ? "#" : href;
            renderComponent = (
                <Link href={checkHref} target={other?.disabled ? "_self" : target}>
                    <Comp {...ortakProps}>{onlyIcon ? onlyIcon : children}</Comp>
                </Link>
            );
        }
    } else {
        renderComponent = (
            <Comp type={type} {...ortakProps}>
                {onlyIcon ? onlyIcon : children}
            </Comp>
        );
    }

    if (title && renderComponent) {
        return (
            <Tooltip title={title} position={titlePosition} arrow={titleArrow}>
                {renderComponent}
            </Tooltip>
        );
    } else {
        return renderComponent;
    }
});
