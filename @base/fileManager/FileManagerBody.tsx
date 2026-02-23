/**
 * @author    : izzetseydaoglu
 * @copyright : sydSOFT Bilişim Hizmetleri (c) 2026
 * @version   : 2026-02-19 22:35:17
 */

import { FileManagerBodyProps, FileManagerFile } from './types';
import { fileManager_onDrag, fileManager_onDrop, fileManager_onMouseDown, fileManager_onMouseMove, fileManager_onMouseUp } from './fileManager.utils';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '../form';
import CloneDrag from './FileManagerCloneDrag';
import { Icon } from '../icon';
import Menu_onContext from './FileManagerContextMenu';
import sDateTime from '../../utils/sDateTime';
import styles from './FileManager.module.css';

export default function Body({
    refMain,
    data,
    setData,
    pathList,
    onUpload,
    onSelect,
    multipleSelect,
    onDrop,
    click,
    doubleClick,
    settings,
    setSettings,
    onSearch,
    menu,
    lastSelectedFile,
    setLastSelectedFile,
    loading,
    getSelected
}: FileManagerBodyProps) {
    const [selection, setSelection] = useState({ start: false, contextMenu: false, x: 0, y: 0 });

    const handleSort = (field: string) => {
        if (settings.sortable === false) return;
        setSettings((prev: any) => ({
            ...prev,
            order: prev.order === 'asc' && prev.orderBy === field ? 'desc' : 'asc',
            orderBy: field
        }));
    };

    const thList = [
        { field: 'name', label: 'Adı' },
        { field: 'modifiedTime', label: 'Değiştirilme Tarihi' },
        { field: 'size', label: 'Boyut' }
    ];

    function mouseDown(e: any) {
        if (onSelect && refMain.current && multipleSelect) {
            fileManager_onMouseDown(e, refMain, data, setData, setSelection);
        }
    }

    function mouseMove(e: any) {
        if (multipleSelect) {
            fileManager_onMouseMove(e, refMain, selection);
        }
    }

    function mouseUp(e: any) {
        if (onSelect && refMain.current && multipleSelect) {
            fileManager_onMouseUp(refMain, selection, setSelection, data, setData, onSelect, multipleSelect);
        }
    }

    const onDrag = useCallback(
        (e: any) => {
            if (!onDrop && !onUpload) return false;
            fileManager_onDrag(e, refMain, e.type, setData);
        },
        [onDrop, onUpload, refMain, setData]
    );

    const drop = useCallback(
        (e: any) => {
            if (!onDrop && !onUpload) return;
            fileManager_onDrop(e, refMain, getSelected, onDrop, onUpload);
        },
        [onDrop, onUpload, refMain, getSelected]
    );

    useEffect(() => {
        if (onUpload || onDrop) {
            window.addEventListener('dragstart', onDrag);
            window.addEventListener('dragenter', onDrag);
            // refBody.current.addEventListener("dragover", onDrag);
            window.addEventListener('dragleave', onDrag);
            window.addEventListener('dragend', onDrag);
            window.addEventListener('drop', drop);
        }

        return () => {
            if (onUpload || onDrop) {
                window.removeEventListener('dragstart', onDrag);
                window.removeEventListener('dragenter', onDrag);
                // window.removeEventListener("dragover", onDrag);
                window.removeEventListener('dragleave', onDrag);
                window.removeEventListener('dragend', onDrag);
                window.removeEventListener('drop', drop);
            }
        };
    }, [onUpload, onDrop, onDrag, drop]);

    function onContextMenu(e: any) {
        e.preventDefault();
        if (!menu) return;
        const clickedElement = document.elementFromPoint(e.clientX, e.clientY);
        if (!clickedElement) return;
        const trElement = clickedElement.closest('tr');
        const fileID = trElement?.getAttribute('data-id');
        if (trElement && fileID) {
            const selectedFile = Object.values(data).find((file: FileManagerFile) => file.id === fileID);
            if (selectedFile) {
                setLastSelectedFile(selectedFile);
                const getSelectedCount = Object.values(data).filter((file: FileManagerFile) => file.selected).length;
                if (getSelectedCount < 2) {
                    setData(Object.values(data).map((file) => ({ ...file, selected: file.id === selectedFile.id })));
                }
            }
        } else {
            setLastSelectedFile(undefined);
            setData(Object.values(data).map((file) => ({ ...file, selected: false })));
        }
        setSelection({
            start: false,
            contextMenu: true,
            x: e.clientX - 2,
            y: e.clientY - 4
        });
    }

    return (
        <div
            className={`${styles.body} filemanager_body`}
            onContextMenu={onContextMenu}
            onMouseDown={mouseDown}
            onMouseMove={mouseMove}
            onMouseUp={mouseUp}
            data-droppable={true}
            data-id={pathList[pathList.length - 1].id || 'anaklasor'}
            onDragOver={(e) => {
                if (e.dataTransfer.types.indexOf('Files') !== -1) {
                    e.preventDefault();
                    if (onUpload) {
                        e.currentTarget.classList.add('droppable');
                    }
                }
            }}
            onDragLeave={(e) => e.currentTarget.classList.remove('droppable')}
        >
            <table>
                <thead>
                    <tr>
                        {thList.map((th, index) => {
                            return (
                                <th key={index} style={{ width: th.field === 'name' ? '70%' : 'auto' }}>
                                    <div className={'th_div'} onClick={() => handleSort(th.field)} data-sortable={settings.sortable}>
                                        {th.label}
                                        {settings.orderBy === th.field && <Icon iconMui={settings.order === 'asc' ? 'arrow_drop_up' : 'arrow_drop_down'} />}
                                    </div>
                                </th>
                            );
                        })}
                        <th style={{ width: 1 }}>
                            <div className={'th_div'} />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {onUpload && (!onSearch || settings.search === '') && (
                        <tr
                            className={'mainupload'}
                            style={{ display: 'none' }}
                            // data-droppable={true}
                            // data-id={pathList[pathList.length - 1].id || "anaklasor"}
                            // onDragOver={(e) => {
                            //     e.preventDefault();
                            //     if (onUpload) {
                            //         e.currentTarget.classList.add("droppable");
                            //     }
                            // }}
                            // onDragLeave={(e) => e.currentTarget.classList.remove("droppable")}
                            // onDrop={(e) => drop(e)}
                        >
                            <td colSpan={4}>
                                <div className={'content'}>
                                    <Icon className={'icon'} iconMui={'cloud_upload'} style={{ color: '#6198BDFF', fontSize: 50 }} />
                                    <div className={'message'}>{pathList[pathList.length - 1].name || 'Ana Klasör'} klasörüne yüklemek istiyorsanız dosyayı buraya veya boş bir alana sürükleyin.</div>
                                </div>
                            </td>
                        </tr>
                    )}
                    {Object.values(data).map((file: any) => {
                        return (
                            <tr
                                key={file.id}
                                className={file.selected ? 'selected' : ''}
                                onClick={(e) => click(e, file)}
                                onDoubleClick={(e) => doubleClick(e, file)}
                                // onContextMenu={(e) => onContextMenu(e, file)}
                                data-id={file.id}
                                draggable={(onDrop || onUpload) && file.selected}
                                data-droppable={(onDrop || onUpload) && file.isFolder && !file.selected}
                                onDragOver={(e) => {
                                    if (file.isFolder) {
                                        e.preventDefault();
                                        if ((onDrop || onUpload) && file.isFolder && !file.selected) {
                                            e.currentTarget.classList.add('droppable');
                                        }
                                    }
                                }}
                                onDragLeave={(e) => e.currentTarget.classList.remove('droppable')}
                            >
                                <td>
                                    <div className={'filename'}>
                                        <img src={file.icon} alt={file.name} width={'auto'} height={'auto'} />
                                        {file.name}
                                    </div>
                                </td>
                                <td>{new sDateTime(file.modifiedTime).format('d/m/y h:i').getResult()}</td>
                                <td>{parseFloat(file.size) > 0 ? (parseFloat(file.size) / (1024 * 1024)).toFixed(2) + ' MB' : ''}</td>
                                <td>{menu && <Button title={'Menu'} onlyIcon={<Icon iconMui={'more_vert'} />} onClick={onContextMenu} />}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {!loading && Object.keys(data).length === 0 && (
                <div className={'nofile'}>
                    <Icon iconMui={settings.search ? 'search_off' : 'folder_open'} color='#6198BDFF' fontSize={50} />
                    <div className={'title'}>{settings.search ? 'Aranan kriterlere uygun dosya bulunamadı.' : 'Klasör boş.'}</div>
                </div>
            )}

            <div id={'selectionarea'} />
            <CloneDrag data={data} />

            {menu && selection.contextMenu && <Menu_onContext menu={menu} lastSelectedFile={lastSelectedFile} data={data} selection={selection} setSelection={setSelection} />}
        </div>
    );
}
