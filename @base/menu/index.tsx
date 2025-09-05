import { Dialog, propsDialog } from "../form";
import React, { memo } from "react";

import Link from "next/link";
import styles from "./index.module.css";

interface BaseProps {
    style?: React.CSSProperties;
    itemProps?: any;
    [key: string]: any;
}
interface SeperatorProps extends BaseProps {
    seperator: boolean;
    title?: never;
    icon?: never;
    fullComponent?: never;
    href?: never;
    onClick?: never;
    dialog?: never;
}
interface FullComponentProps extends BaseProps {
    fullComponent: React.ReactElement;
    seperator?: never;
    title?: never;
    icon?: never;
    href?: never;
    onClick?: never;
    dialog?: never;
}
interface ItemComponentProps extends BaseProps {
    seperator?: false;
    fullComponent?: never;
    title: string;
    icon?: React.ReactNode;
    href?: string;
    onClick?: (e: React.MouseEvent<HTMLLIElement>) => void;
    dialog?: propsDialog;
}

export type typeMenu = SeperatorProps | FullComponentProps | ItemComponentProps;

interface Props {
    menu: typeMenu[];
    className?: string;
    style?: React.CSSProperties;
    withIcon?: boolean;
}

export const Menu = memo(function MemoFunction({ menu, className, style, withIcon = true }: Props) {
    const handleClick = (item: any, e: any) => {
        if (!item.onClick) return;
        if (item.dialog) {
            Dialog({ ...item.dialog }).then((result) => {
                if (result && item.onClick) {
                    item.onClick(e);
                }
            });
        } else {
            item.onClick(e);
        }
    };

    return (
        <ul className={`smenu ${styles.ul} ${className || ""}`} style={style}>
            {Object.values(menu).map((item: typeMenu, key: number) => {
                const { fullComponent, icon, title, onClick, seperator, href, style, itemProps, ...other } = item;
                if (fullComponent) return React.cloneElement(fullComponent, { key: key });
                if (seperator) return <li key={key} className={`${styles.li} ${styles.seperator}`} style={style} {...itemProps} {...other} />;
                const Component = (
                    <>
                        {withIcon && <div className={styles.menuicon}>{icon}</div>}
                        <div className={styles.menutitle}>{title}</div>
                    </>
                );
            
                return (
                    <li key={key} className={`${styles.li}`} style={style} onClick={(e: any) => handleClick(item, e)} {...itemProps} {...other}>
                       {(href) ? <Link href={href}>{Component}</Link> : Component}
                    </li>
                );
            })}
        </ul>
    );
});
