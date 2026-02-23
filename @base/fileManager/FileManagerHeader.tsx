/**
 * @author    : izzetseydaoglu
 * @copyright : sydSOFT Bilişim Hizmetleri (c) 2026
 * @version   : 2026-02-19 03:14:42
 */

import React, { useEffect, useRef, useState } from 'react';

import { FileManagerHeaderProps } from './types';
import { Icon } from '../icon';
import { Input } from '../form';
import Menu_Header from './FileManagerHeaderMenu';
import { Tooltip } from '../tooltip';
import styles from './FileManager.module.css';

export default function Header({ data, pathList, settings, setSettings, removePathList, onSearch, onDrop, menu, lastSelectedFile }: FileManagerHeaderProps) {
    const isSearchable = settings.searchable !== false;
    const [searchValue, setSearchValue] = useState<string>(settings.search);
    const onSearchRef = useRef(onSearch);
    const pathListRef = useRef<HTMLDivElement>(null);

    const isPathDroppable = (index: number) => !!onDrop && index !== pathList.length - 1;
    const getPathDroppableAttr = (index: number) => (onDrop && index === pathList.length - 1 ? 'false' : 'true');

    useEffect(() => {
        onSearchRef.current = onSearch;
    }, [onSearch]);

    useEffect(() => {
        setSearchValue(settings.search);
    }, [settings.search]);

    useEffect(() => {
        if (!isSearchable) return;
        if (settings.search === searchValue) return;

        const timeout = window.setTimeout(() => {
            setSettings((prev) => (prev.search === searchValue ? prev : { ...prev, search: searchValue }));
            onSearchRef.current?.(searchValue);
        }, 300);

        return () => window.clearTimeout(timeout);
    }, [isSearchable, searchValue, setSettings, settings.search]);

    useEffect(() => {
        const onResize = () => {
            if (!pathListRef.current) return;
            pathListRef.current.scrollLeft = pathListRef.current.scrollWidth;
        };

        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    useEffect(() => {
        const raf = window.requestAnimationFrame(() => {
            if (!pathListRef.current) return;
            pathListRef.current.scrollLeft = pathListRef.current.scrollWidth;
        });

        return () => window.cancelAnimationFrame(raf);
    }, [pathList, settings.search, isSearchable]);

    return (
        <div className={styles.header}>
            <div className={'path_list'} ref={pathListRef}>
                {(!onSearch || settings.search === '' || !isSearchable) &&
                    pathList.map((path, index) => {
                        return (
                            <div
                                key={path.id}
                                className={'path'}
                                onClick={() => removePathList(path, index)}
                                data-id={path.id}
                                data-droppable={getPathDroppableAttr(index)}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    if (isPathDroppable(index)) {
                                        e.currentTarget.classList.add('droppable');
                                    }
                                }}
                                onDragLeave={(e) => e.currentTarget.classList.remove('droppable')}
                            >
                                <Tooltip title={path.name}>
                                    <span className={'name'}>{path.name}</span>
                                </Tooltip>
                                {index !== pathList.length - 1 && <Icon iconMui={'chevron_right'} />}
                            </div>
                        );
                    })}
                {isSearchable && onSearch && settings.search !== '' && (
                    <div className={'path'}>
                        <Tooltip title={settings.search}>
                            <span className={'name'}>Arama sonuçları:</span>
                        </Tooltip>
                    </div>
                )}
            </div>
            {isSearchable && (
                <div className={'search'}>
                    <Input type={'search'} placeholder={'Ara...'} value={searchValue} onChange={(e: any) => setSearchValue(e.target.value)} />
                </div>
            )}
            {menu && <Menu_Header menu={menu} data={data} lastSelectedFile={lastSelectedFile} />}
        </div>
    );
}
