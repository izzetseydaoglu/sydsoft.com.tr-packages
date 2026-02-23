/**
 * @author    : izzetseydaoglu
 * @copyright : sydSOFT Bilişim Hizmetleri (c) 2026
 * @version   : 2026-02-19 21:45:39
 */

import { FileManagerMenu, FileManagerMenuHeaderProps } from './types';
import React, { useMemo } from 'react';

import { Button } from '../form';
import styles from './FileManager.module.css';

export default function Menu_Header({ menu, data, lastSelectedFile }: FileManagerMenuHeaderProps) {
    const visibleMenuItems = useMemo(() => {
        return menu
            .map((factory: any, index: number) => ({ index, item: factory(lastSelectedFile, data) as FileManagerMenu }))
            .filter(({ item }) => {
                if (!item) return false;
                if (item.onlyRender || item.noRender || item.hideInMenu) return false;
                if (typeof item.onClick !== 'function') return false;
                if (typeof item.name !== 'string' || item.name.trim() === '') return false;
                return true;
            });
    }, [menu, lastSelectedFile, data]);

    if (visibleMenuItems.length === 0) return null;

    return (
        <div className={styles.headerMenu}>
            <div className={'seperator'} />
            {visibleMenuItems.map(({ index, item: menuItem }) => {
                const order = menuItem.order ?? index;
                return (
                    <React.Fragment key={index}>
                        {menuItem.beforeSeparator && <div className={'seperator'} style={{ order }} />}
                        <Button onlyIcon={menuItem.icon} title={menuItem.name} onClick={(e: any) => menuItem.onClick(e)} disabled={menuItem.disabled} style={{ order }} />
                        {menuItem.afterSeparator && <div className={'seperator'} style={{ order }} />}
                    </React.Fragment>
                );
            })}
        </div>
    );
}
