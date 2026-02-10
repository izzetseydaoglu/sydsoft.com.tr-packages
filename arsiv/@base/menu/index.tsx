/**
 * @author    : izzetseydaoglu
 * @copyright : sydSOFT Bilişim Hizmetleri (c) 2026
 * @version   : 2026-02-07 19:31:01
 */

import React, { memo, useMemo } from 'react';
import { Dialog, propsDialog } from '../form';
import { Popover, PopoverConfigBaseProps } from '../popover';

import Link from 'next/link';
import styles from './index.module.css';

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
    type?: never;
    title: string;
    icon?: React.ReactNode;
    rightComponent?: React.ReactNode;
    href?: string;
    onClick?: (e: React.MouseEvent<HTMLLIElement>) => void;
    dialog?: propsDialog;
}

interface SubMenuProps extends BaseProps {
    type: 'submenu';
    title: string;
    items: typeMenu[];
    icon?: React.ReactNode;
    subMenuPopoverProps?: PopoverConfigBaseProps;
    rightComponent?: React.ReactNode;
    menuProps?: {
        className?: string;
        style?: React.CSSProperties;
        withIcon?: boolean | 'auto';
    };
    seperator?: never;
    fullComponent?: never;
    href?: never;
    onClick?: never;
    dialog?: never;
}

export type typeMenu = SeperatorProps | FullComponentProps | ItemComponentProps | SubMenuProps;

interface Props {
    menu: typeMenu[];
    className?: string;
    style?: React.CSSProperties;
    withIcon?: boolean | 'auto';
}

export const Menu = memo(function MemoFunction({ menu, className, style, withIcon = 'auto' }: Props) {
    const withIconComponent = useMemo(() => {
        if (withIcon === true) return true;
        if (withIcon === false) return false;
        return Object.values(menu).some((item) => 'icon' in item && !!item.icon);
    }, [menu, withIcon]);

    const withRightComponent = useMemo(() => {
        return Object.values(menu).some((item) => 'rightComponent' in item && !!item.rightComponent);
    }, [menu]);
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
        <ul className={`smenu ${styles.ul} ${className || ''}`} style={style}>
            {Object.values(menu).map((item: typeMenu, key: number) => {
                const { fullComponent, icon, title, rightComponent, seperator, href, style, itemProps, type, items, menuProps, subMenuPopoverProps, ...other } = item as typeMenu & {
                    subMenuPopoverProps?: PopoverConfigBaseProps;
                };
                const hasSubmenu = type === 'submenu' && Array.isArray(items) && items.length > 0;

                if (fullComponent) return React.cloneElement(fullComponent, { key: key });
                if (seperator) return <li key={key} className={styles.seperator} style={style} {...itemProps} {...other} />;
                const Component = (
                    <>
                        {withIconComponent && <div className={styles.menuicon}>{icon}</div>}
                        <div className={styles.menutitle}>{title}</div>
                        {withRightComponent && <div className={styles.rightmenu}>{rightComponent}</div>}
                    </>
                );

                if (hasSubmenu) {
                    return (
                        <Popover
                            key={key}
                            component={
                                <li style={style} {...itemProps} {...other}>
                                    {Component}
                                </li>
                            }
                            position="right-top"
                            {...(subMenuPopoverProps || {})}
                        >
                            <Menu menu={items} {...(menuProps || {})} />
                        </Popover>
                    );
                }

                return (
                    <li key={key} style={style} onClick={(e: any) => handleClick(item, e)} {...itemProps} {...other}>
                        {href ? <Link href={href}>{Component}</Link> : Component}
                    </li>
                );
            })}
        </ul>
    );
});
