/**
 * @author    : izzetseydaoglu
 * @copyright : sydSOFT Bilişim Hizmetleri (c) 2026
 * @version   : 2026-02-19 00:05:58
 */

import React, { useEffect, useMemo, useRef } from 'react';
import { FileManagerMenu, FileManagerMenuOnContextProps } from './types';
import styles from './FileManager.module.css';

export default function Menu_onContext({ menu, data, lastSelectedFile, selection, setSelection }: FileManagerMenuOnContextProps) {
    const refContextMenu = useRef<any>(null);

    function hideContextMenu() {
        setSelection((prev: any) => ({ ...prev, contextMenu: false }));
        window.removeEventListener('mousedown', checkHideContextMenu);
    }

    const checkHideContextMenu = (e: any) => {
        if (refContextMenu.current && !refContextMenu.current.contains(e.target)) {
            hideContextMenu();
        }
    };

    const visibleMenuItems = useMemo(() => {
        return menu
            .map((factory: any, index: number) => ({ index, item: factory(lastSelectedFile, data) as FileManagerMenu }))
            .filter(({ item }) => {
                if (!item) return false;
                if (item.onlyRender || item.noRender || item.hideInContextMenu) return false;
                if (typeof item.onClick !== 'function') return false;
                if (typeof item.name !== 'string' || item.name.trim() === '') return false;
                return true;
            });
    }, [menu, lastSelectedFile, data]);

    useEffect(() => {
        if (selection.contextMenu) {
            window.addEventListener('mousedown', checkHideContextMenu);
        } else {
            window.removeEventListener('mousedown', checkHideContextMenu);
        }
    }, [selection.contextMenu]);

    useEffect(() => {
        if (refContextMenu.current) {
            const component = refContextMenu.current.getBoundingClientRect();
            let newX = selection.x;
            let newY = selection.y;
            if (selection.x + component.width > window.innerWidth) {
                newX = window.innerWidth - component.width - 10;
            }
            if (selection.y + component.height > window.innerHeight) {
                newY = window.innerHeight - component.height - 10;
            }
            if (newX !== selection.x || newY !== selection.y) {
                setSelection((prev: any) => ({ ...prev, x: newX, y: newY }));
            }
        }
    }, [selection.x, selection.y]);

    if (visibleMenuItems.length === 0) return null;

    return (
        <div
            className={styles.contextMenu}
            ref={refContextMenu}
            style={{ top: selection.y, left: selection.x }}
            onBlur={() => setSelection({ start: false, contextMenu: false, x: 0, y: 0 })}
        >
            {visibleMenuItems.map(({ item, index }) => {
                const order = item.order ?? index;
                return (
                    <React.Fragment key={index}>
                        {item.beforeSeparator && <div className={'seperator_h'} style={{ order }} />}
                        <button
                            onClick={(e: any) => {
                                item.onClick(e);
                                hideContextMenu();
                            }}
                            disabled={item.disabled}
                            style={{ order }}
                        >
                            {item.icon && <div className={'icon'}>{item.icon}</div>}
                            <div className={'name'}>{item.name}</div>
                        </button>
                        {item.afterSeparator && <div className={'seperator_h'} style={{ order }} />}
                    </React.Fragment>
                );
            })}
        </div>
    );
}
