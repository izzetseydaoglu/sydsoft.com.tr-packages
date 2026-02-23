/**
 * @author    : izzetseydaoglu
 * @copyright : sydSOFT Bilişim Hizmetleri (c) 2026
 * @version   : 2026-02-19 21:33:34
 */

import { FileManagerFile, FileManagerHandles, FileManagerPathItem, FileManagerProps, FileManagerSettings } from './types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import Body from './FileManagerBody';
import Header from './FileManagerHeader';
import { Loading } from './FileManagerLoading';
import { fileManager_Sort } from './fileManager.utils';
import styles from './FileManager.module.css';

export const useFileManager = ({ files, rootFolder, onSelect, onClick, onDoubleClick, onSearch, onUpload, onDrop, onChangeFolder, settings, multipleSelect = false, menu }: FileManagerProps) => {
    const refMain = React.useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [fileManagerSettings, setFileManagerSettings] = useState<FileManagerSettings>({
        sortable: settings?.sortable !== false,
        search: settings?.search || '',
        searchable: settings?.searchable !== false,
        orderBy: settings?.orderBy || 'name',
        order: settings?.order || 'asc'
    });
    const [lastSelectedFile, setLastSelectedFile] = useState<FileManagerFile>();
    const [data, setData] = useState<FileManagerFile[]>([]);

    const [pathList, setPathList] = useState<FileManagerPathItem[]>([{ id: rootFolder.id, name: rootFolder.name }]);
    const isSearchable = fileManagerSettings.searchable !== false;
    const activeOnSearch = isSearchable ? onSearch : undefined;
    const isExternalSearch = !!activeOnSearch;

    const filesDigest = useMemo(() => {
        return JSON.stringify(
            files.map((file) => ({
                id: file.id,
                name: file.name,
                parent: file.parent,
                mimeType: file.mimeType,
                fileExtension: file.fileExtension,
                icon: file.icon,
                size: file.size,
                modifiedTime: file.modifiedTime,
                isFolder: file.isFolder,
                md5: file.md5
            }))
        );
    }, [files]);

    const getSelected = useCallback(() => Object.values(data).filter((file) => file.selected), [data]);

    useEffect(() => {
        const newSettings = { ...fileManagerSettings };
        if (isExternalSearch) {
            newSettings.search = '';
        }
        setData(
            fileManager_Sort(
                files.map((file: any) => ({ ...file, selected: false })),
                newSettings
            )
        );
        setLastSelectedFile(undefined);
    }, [filesDigest, fileManagerSettings, isExternalSearch]);

    useEffect(() => {
        setPathList([{ id: rootFolder.id, name: rootFolder.name }]);
    }, [rootFolder.id, rootFolder.name]);

    useEffect(() => {
        if (!isSearchable && fileManagerSettings.search !== '') {
            setFileManagerSettings((prev) => ({ ...prev, search: '' }));
        }
    }, [isSearchable, fileManagerSettings.search]);

    const addPathList = useCallback((path: FileManagerFile | FileManagerPathItem) => {
        setPathList((prev) => {
            return [...prev, { id: path.id, name: path.name }];
        });
        setFileManagerSettings((prev: any) => ({ ...prev, search: '' }));
    }, []);

    const removePathList = (path: FileManagerPathItem, index: number) => {
        if (index === pathList.length - 1) return;
        setPathList((prev) => {
            return prev.slice(0, index + 1);
        });
        onChangeFolder && onChangeFolder(path);
        setFileManagerSettings((prev: any) => ({ ...prev, search: '' }));
    };

    const click = (e: any, item: FileManagerFile) => {
        if (onSelect) {
            if (e.ctrlKey || e.metaKey) {
                const newData = Object.values(data).map((file) => {
                    if (file.id === item.id) {
                        return { ...file, selected: !file.selected };
                    }
                    return { ...file };
                });
                setLastSelectedFile(Object.values(newData).find((file) => file.selected));
                setData(newData);
                onSelect(Object.values(newData).filter((file) => file.selected));
            } else if (multipleSelect && e.shiftKey && lastSelectedFile) {
                const lastSelectedId = lastSelectedFile.id;
                const lastSelectedIndex = Object.values(data).findIndex((i) => i.id === lastSelectedId);
                const nowSelectedIndex = Object.values(data).findIndex((i) => i.id === item.id);
                const start = lastSelectedIndex > nowSelectedIndex ? nowSelectedIndex : lastSelectedIndex;
                const end = lastSelectedIndex > nowSelectedIndex ? lastSelectedIndex : nowSelectedIndex;

                const newData = Object.values(data).map((file, index) => ({ ...file, selected: index >= start && index <= end }));
                setData(newData);
                onSelect(Object.values(newData).filter((file) => file.selected));
            } else {
                const newData = Object.values(data).map((file) => {
                    if (file.id === item.id) {
                        return { ...file, selected: !file.selected };
                    } else {
                        return { ...file, selected: false };
                    }
                });
                setLastSelectedFile(Object.values(newData).find((file) => file.selected));
                setData(newData);
                onSelect(Object.values(newData).filter((file) => file.selected));
            }
        }
        onClick && onClick(item);
    };

    const doubleClick = (e: any, file: FileManagerFile) => {
        onDoubleClick && onDoubleClick(file);
        if (onChangeFolder && file.isFolder) {
            onChangeFolder(file);
            addPathList(file);
        }
    };

    const fileManagerHandles: FileManagerHandles = useMemo(
        () => ({
            setLoading: (loading: boolean) => setLoading(loading),
            addPathList: (path: FileManagerFile | FileManagerPathItem) => addPathList(path),
            getSelected
        }),
        [addPathList, getSelected]
    );

    const FileManagerComponent = () => {
        return (
            <div ref={refMain} className={styles.root}>
                <Loading show={loading} />
                <Header
                    data={data}
                    pathList={pathList}
                    removePathList={removePathList}
                    settings={fileManagerSettings}
                    setSettings={setFileManagerSettings}
                    onDrop={onDrop}
                    menu={menu}
                    lastSelectedFile={lastSelectedFile}
                    onSearch={activeOnSearch}
                />
                <Body
                    refMain={refMain}
                    data={data}
                    setData={setData}
                    pathList={pathList}
                    click={click}
                    doubleClick={doubleClick}
                    settings={fileManagerSettings}
                    setSettings={setFileManagerSettings}
                    onSelect={onSelect}
                    multipleSelect={multipleSelect}
                    onUpload={onUpload}
                    onDrop={onDrop}
                    menu={menu}
                    lastSelectedFile={lastSelectedFile}
                    setLastSelectedFile={setLastSelectedFile}
                    loading={loading}
                    onSearch={activeOnSearch}
                    getSelected={getSelected}
                />
            </div>
        );
    };

    return {
        ...fileManagerHandles,
        Component: FileManagerComponent()
    };
};
