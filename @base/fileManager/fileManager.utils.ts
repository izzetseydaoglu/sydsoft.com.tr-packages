/**
 * @author    : izzetseydaoglu
 * @copyright : sydSOFT Bilişim Hizmetleri (c) 2026
 * @version   : 2026-02-19 00:25:27
 */

import { FileManagerFile } from './types';

import React from 'react';

export function fileManager_ConvertForSearch(value: string) {
    if (!value) return '';
    let data = value.toString().toLocaleLowerCase('tr-TR');
    data = data.replace(/ö/g, 'o');
    data = data.replace(/ç/g, 'c');
    data = data.replace(/ş/g, 's');
    data = data.replace(/ı/g, 'i');
    data = data.replace(/ğ/g, 'g');
    data = data.replace(/ü/g, 'u');
    data = data.replace(/[^a-z\d]/g, ''); // %_- are allowed
    data = data.replace(/^\s+|\s+$/g, '');
    return data;
}

export function fileManager_Sort(files: FileManagerFile[], settings: any) {
    let newList: FileManagerFile[] = Object.values(files);
    if (settings.search.length > 0) {
        const aranan = fileManager_ConvertForSearch(settings.search).trim();
        newList = newList.filter((o) => Object.values(o).some((k) => fileManager_ConvertForSearch(k as string).includes(aranan)));
    }

    newList = Object.values(newList).sort((a: any, b: any) => {
        if (typeof a[settings.orderBy] === 'undefined' || a[settings.orderBy] === null) return 1;
        if (typeof b[settings.orderBy] === 'undefined' || b[settings.orderBy] === null) return -1;

        function convertType(value: any) {
            if (typeof value == 'number' && !isNaN(value)) {
                return value.toString();
            }

            if (value === true || value === false) {
                return value ? '1' : '-1';
            }

            return value;
        }

        const aLocale = convertType(a[settings.orderBy]);
        const bLocale = convertType(b[settings.orderBy]);

        if (settings.order === 'asc') {
            return aLocale.localeCompare(bLocale, 'tr', { numeric: typeof b[settings.orderBy] == 'number' && !isNaN(b[settings.orderBy]) });
        } else {
            return bLocale.localeCompare(aLocale, 'tr', { numeric: typeof a[settings.orderBy] == 'number' && !isNaN(a[settings.orderBy]) });
        }
    });
    newList = newList.sort((a: FileManagerFile, b: FileManagerFile) => {
        function isFolder(file: FileManagerFile) {
            return file.isFolder ? 1 : 0;
        }

        return isFolder(b) - isFolder(a);
    });
    return newList;
}

let fileManager_DragStart = false;
let fileManager_DragFile = false;
let fileManager_ListSelection: string[] = [];
let fileManager_TimerSelection: any = 0;

export function fileManager_onMouseDown(e: React.DragEvent<HTMLDivElement>, refMain: React.RefObject<HTMLDivElement | null>, data: FileManagerFile[], setData: Function, setSelection: Function) {
    if (e.button !== 0) return;
    if (refMain.current) {
        const divBody = refMain.current.querySelector('.filemanager_body');
        if (!divBody) return false;

        clearTimeout(fileManager_TimerSelection);
        const x = e.clientX + divBody.scrollLeft - divBody.getBoundingClientRect().x;
        const y = e.clientY + divBody.scrollTop - divBody.getBoundingClientRect().y;
        fileManager_TimerSelection = setTimeout(() => {
            if (!fileManager_DragStart) {
                setSelection({ start: true, contextMenu: false, x, y });
                setData(Object.values(data).map((file: any) => ({ ...file, selected: false })));
            }
        }, 350);
    }
}

export function fileManager_onMouseMove(e: React.DragEvent<HTMLDivElement>, refMain: React.RefObject<HTMLDivElement | null>, selection: any) {
    if (selection.start && refMain.current) {
        const divBody = refMain.current.querySelector('.filemanager_body');
        if (!divBody) return false;

        const MainBaseTop = divBody.getBoundingClientRect().y;
        const MainBaseLeft = divBody.getBoundingClientRect().x;
        const scrollTop = divBody.scrollTop;
        const scrollLeft = divBody.scrollLeft;

        const mouseX = e.clientX + scrollLeft - MainBaseLeft;
        const mouseY = e.clientY + scrollTop - MainBaseTop;

        const x3 = Math.min(selection.x, mouseX); //Smaller X
        const x4 = Math.max(selection.x, mouseX); //Larger X
        const y3 = Math.min(selection.y, mouseY); //Smaller Y
        const y4 = Math.max(selection.y, mouseY); //Larger Y
        const refSelection: any = refMain.current.querySelector('#selectionarea');
        if (refSelection) {
            refSelection.style.display = 'block';
            refSelection.style.left = x3 + 'px';
            refSelection.style.top = y3 + 'px';
            refSelection.style.width = x4 - x3 + 'px';
            refSelection.style.height = y4 - y3 + 'px';
        }

        const start = selection.y < mouseY ? selection.y : mouseY;
        const end = mouseY > selection.y ? mouseY : selection.y;
        fileManager_ListSelection = [];
        refMain.current.querySelectorAll('tbody>tr').forEach((item) => {
            const id = item.getAttribute('data-id');
            const itemPosition = item.getBoundingClientRect().top + item.getBoundingClientRect().height / 2 + scrollTop - MainBaseTop;
            if (itemPosition >= start && itemPosition <= end) {
                item.classList.add('selected');
                if (id) {
                    fileManager_ListSelection.push(id);
                }
            } else {
                item.classList.remove('selected');
            }
        });
    }
}

export function fileManager_onMouseUp(
    refMain: React.RefObject<HTMLDivElement | null>,
    selection: any,
    setSelection: Function,
    data: FileManagerFile[],
    setData: Function,
    onSelect: Function,
    multipleSelect: boolean
) {
    if (onSelect && refMain.current && multipleSelect) {
        clearTimeout(fileManager_TimerSelection);
        if (selection.start) {
            const refSelection: any = refMain.current.querySelector('#selectionarea');
            if (refSelection) {
                refSelection.style.display = 'none';
            }
            setSelection({ start: false, contextMenu: false, x: 0, y: 0 });
            if (fileManager_ListSelection.length > 0) {
                const newData = Object.values(data).map((file: any) => ({ ...file, selected: fileManager_ListSelection.includes(file.id) }));
                setData(newData);
                onSelect(Object.values(newData).filter((file: any) => file.selected));
                fileManager_ListSelection = [];
            }
        }
    }
}

export function fileManager_onDrag(e: any, refMain: React.RefObject<HTMLDivElement | null>, status: string = 'dragstart', setData: Function) {
    if (!refMain.current) return;

    const refMainUpload: any = refMain.current.querySelector('.mainupload');

    fileManager_DragFile = e.dataTransfer.types.indexOf('Files') !== -1;
    if (fileManager_DragFile && refMainUpload) {
        refMainUpload.style.display = 'table-row';
    } else {
        if (refMainUpload) {
            refMainUpload.style.display = 'none';
        }
    }

    if (status === 'dragstart' || status === 'dragenter') {
        const refCloneDrag: any = refMain.current.querySelector('#clonedrag');
        if (refCloneDrag) {
            refCloneDrag.style.display = 'flex';
            e.dataTransfer.setDragImage(refCloneDrag, 0, 0);
        }

        fileManager_DragStart = true;
        refMain.current.classList.add('dragging');
        if (fileManager_DragFile) {
            setData((prevState: any) => Object.values(prevState).map((file: any) => ({ ...file, selected: false })));
        }
        // isDev && console.log("status=>", status);
    }

    if (status === 'dragleave') {
        if (refMain.current.contains(e.relatedTarget)) return;
        refMain.current.classList.remove('dragging');
        if (refMainUpload) {
            refMainUpload.style.display = 'none';
        }
        // isDev && console.log("status=>", status);
    }

    if (status === 'dragend') {
        fileManager_DragFile = false;
        fileManager_DragStart = false;
        window.document.body.querySelectorAll('.droppable').forEach((item: any) => {
            item.classList.remove('droppable');
        });
        refMain.current.classList.remove('dragging');
        const refCloneDrag: any = refMain.current.querySelector('#clonedrag');
        if (refCloneDrag) {
            refCloneDrag.style.display = 'none';
        }
        if (refMainUpload) {
            refMainUpload.style.display = 'none';
        }
        // isDev && console.log("status=>", status);
    }
}

export function fileManager_onDrop(
    e: React.DragEvent<HTMLDivElement>,
    refMain: React.RefObject<HTMLDivElement | null>,
    getSelected: () => FileManagerFile[],
    onDrop?: Function,
    onUpload?: Function
) {
    e.preventDefault();
    e.stopPropagation();

    const endDrop = () => {
        window.document.body.querySelectorAll('.droppable').forEach((item: any) => {
            item.classList.remove('droppable');
        });
        refMain.current && refMain.current.classList.remove('dragging');

        const refMainUpload: any = refMain.current && refMain.current.querySelector('.mainupload');
        if (refMainUpload) {
            refMainUpload.style.display = 'none';
        }
    };

    if ((!onDrop && !onUpload) || !refMain.current) {
        endDrop();
        return;
    }

    const clickedElement = document.elementFromPoint(e.clientX, e.clientY);
    if (clickedElement) {
        let targetElement = clickedElement.closest("[data-droppable='true']");
        if (!targetElement) {
            endDrop();
            return;
        }
        const droppable = targetElement.getAttribute('data-droppable');
        if (droppable !== 'true') {
            endDrop();
            return;
        }
        const targetID = targetElement.getAttribute('data-id');
        if (!targetID) {
            endDrop();
            return;
        }

        if (e.dataTransfer.files.length > 0) {
            onUpload && onUpload(targetID, e.dataTransfer.files);
        } else {
            const listSelected = getSelected();
            if (listSelected.length > 0) {
                onDrop && onDrop(targetID, listSelected);
            }
        }
    }
    endDrop();
}
