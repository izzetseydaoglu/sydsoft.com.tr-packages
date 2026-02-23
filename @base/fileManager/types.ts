/**
 * @author    : izzetseydaoglu
 * @copyright : sydSOFT Bilişim Hizmetleri (c) 2026
 * @version   : 2026-02-19 21:51:50
 */

import React from 'react';

export type FileManagerFile = {
    id: string;
    name: string;
    parent: string;
    mimeType: string;
    fileExtension: string;
    icon: string;
    size: number;
    modifiedTime: string;
    isFolder: boolean;
    md5: string;
    selected?: boolean;
};

export type FileManagerPathItem = {
    id: string;
    name: string;
};

export type FileManagerMenu = {
    icon: React.ReactNode;
    name: string;
    onClick: (file: FileManagerFile) => void;
    hideInContextMenu?: boolean;
    hideInMenu?: boolean;
    onlyRender?: boolean;
    noRender?: boolean;
    disabled?: boolean;
    afterSeparator?: boolean;
    beforeSeparator?: boolean;
    order?: number;
};

export type FileManagerSettings = {
    sortable: boolean;
    searchable: boolean;
    search: string;
    orderBy: 'name' | 'modifiedTime' | 'size';
    order: string;
};

export interface FileManagerProps {
    files: FileManagerFile[];
    menu?: ((file: FileManagerFile | undefined, files: FileManagerFile[]) => FileManagerMenu)[];
    rootFolder: FileManagerPathItem;
    multipleSelect?: boolean;
    onSelect?: (list: FileManagerFile[]) => void;
    onClick?: (file: FileManagerFile) => void;
    onDoubleClick?: (file: FileManagerFile) => void;
    onDrop?: (targetID: string, files: FileManagerFile[]) => void;
    onChangeFolder?: (folder: FileManagerFile | FileManagerPathItem) => void;
    onUpload?: (targetID: string, files: FileList) => void;
    onSearch?: (search: string) => void;
    settings?: FileManagerSettings;
}

export type FileManagerHandles = {
    setLoading: (loading: boolean) => void;
    addPathList: (path: FileManagerFile | FileManagerPathItem) => void;
    getSelected: () => FileManagerFile[];
};

export interface FileManagerBodyProps {
    refMain: React.RefObject<HTMLDivElement | null>;
    data: FileManagerFile[];
    setData: Function;
    click: (e: any, file: FileManagerFile) => void;
    doubleClick: (e: any, file: FileManagerFile) => void;
    settings: any;
    setSettings: any;
    multipleSelect?: boolean;
    onSelect?: (list: FileManagerFile[]) => void;
    onDrop?: (targetID: string, files: FileManagerFile[]) => void;
    onUpload?: Function;
    menu?: any;
    lastSelectedFile: FileManagerFile | undefined;
    setLastSelectedFile: Function;
    pathList: FileManagerPathItem[];
    loading?: boolean;
    onSearch?: (search: string) => void;
    getSelected: () => FileManagerFile[];
}

export interface FileManagerHeaderProps {
    data: FileManagerFile[];
    pathList: FileManagerPathItem[];
    settings: FileManagerSettings;
    setSettings: React.Dispatch<React.SetStateAction<FileManagerSettings>>;
    removePathList: (path: FileManagerPathItem, index: number) => void;
    onDrop?: (targetID: string, files: FileManagerFile[]) => void;
    menu?: any;
    lastSelectedFile: FileManagerFile | undefined;
    onSearch?: (search: string) => void;
}

export interface FileManagerMenuHeaderProps {
    menu: ((file: FileManagerFile | undefined, files: FileManagerFile[]) => FileManagerMenu)[];
    data: FileManagerFile[];
    lastSelectedFile: FileManagerFile | undefined;
}

export interface FileManagerMenuOnContextProps {
    menu: ((file: FileManagerFile | undefined, files: FileManagerFile[]) => FileManagerMenu)[];
    data: FileManagerFile[];
    lastSelectedFile: FileManagerFile | undefined;
    selection: any;
    setSelection: any;
}

export interface FileManagerCloneDragProps {
    data: FileManagerFile[];
}

// Backward-compatible aliases
export type typeFileManager_File = FileManagerFile;
export type typeFileManager_PathItem = FileManagerPathItem;
export type typeFileManager_Menu = FileManagerMenu;
export type typeFileManager_Settings = FileManagerSettings;
export type typeFileManager_Props = FileManagerProps;
export type typeFileManager_Handle = FileManagerHandles;
export type typeFileManager_BodyProps = FileManagerBodyProps;
export type typeFileManager_HeaderProps = FileManagerHeaderProps;
export type typeFileManager_MenuHeaderProps = FileManagerMenuHeaderProps;
export type typeFileManager_MenuOnContextProps = FileManagerMenuOnContextProps;
export type typeFileManager_CloneDragProps = FileManagerCloneDragProps;
