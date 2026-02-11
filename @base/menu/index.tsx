/**
 * @author    : izzetseydaoglu
 * @copyright : sydSOFT Bilişim Hizmetleri (c) 2026
 * @version   : 2026-02-11 18:48:47
 */

import React, { memo, useMemo } from 'react';
import { Dialog, propsDialog } from '../form';
import { Popover, PopoverConfigBaseProps } from '../popover';

import Link from 'next/link';
import styles from './index.module.css';

interface BaseProps {
    style?: React.CSSProperties;
    itemProps?: any;
    disabled?: boolean;
    noRender?: boolean;
    [key: string]: any;
}
interface SeperatorProps extends BaseProps {
    seperator: boolean;
    title?: never;
    icon?: never;
    fullComponent?: never;
    href?: never;
    target?: never;
    onClick?: never;
    dialog?: never;
}
interface FullComponentProps extends BaseProps {
    fullComponent: React.ReactElement;
    seperator?: never;
    title?: never;
    icon?: never;
    href?: never;
    target?: never;
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
    target?: '_blank' | '_self' | '_parent' | '_top';
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
    target?: never;
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
        if (item.disabled) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
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
                const { noRender, fullComponent, icon, title, rightComponent, seperator, href, target, style, itemProps, type, items, menuProps, subMenuPopoverProps, disabled, ...other } =
                    item as typeMenu & {
                        subMenuPopoverProps?: PopoverConfigBaseProps;
                    };
                if (noRender) return null;

                const hasSubmenu = type === 'submenu' && Array.isArray(items) && items.length > 0;

                if (fullComponent) return React.cloneElement(fullComponent, { key: key });

                if (seperator) return <li key={key} className={styles.seperator} style={style} {...itemProps} {...other} />;

                const Component = (
                    <>
                        {withIconComponent && <div className={'menuicon'}>{icon}</div>}
                        <div className={'menutitle'}>{title}</div>
                        {withRightComponent && <div className={'menuright'}>{rightComponent}</div>}
                    </>
                );

                if (hasSubmenu) {
                    return (
                        <Popover
                            key={key}
                            component={
                                <li style={style} disabled={disabled} {...itemProps} {...other}>
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
                    <li key={key} style={style} disabled={disabled} {...itemProps} {...other} onClick={(e: any) => handleClick(item, e)}>
                        {href ? (
                            <Link href={href} target={target}>
                                {Component}
                            </Link>
                        ) : (
                            Component
                        )}
                    </li>
                );
            })}
        </ul>
    );
});
