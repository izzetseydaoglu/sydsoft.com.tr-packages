/**
 * Copyright (c) 2024
 *  @author: izzetseydaoglu
 *  @last-modified: 6.03.2024 03:23
 */


import React, {useEffect, useRef} from 'react';
import {alert_add} from "@sydsoft.com.tr/alert";


interface Props {
    children?: React.ReactNode,
    refUploadInput?: any,
    required?: boolean,
    multiple?: boolean,
    ext_ok?: string[],
    maxSize?: number,
    style?: React.CSSProperties,
    onChange?: Function,
    targetForm?: Function,
    name?: string
    label?: string
}

const upload_ext_ok = ["pdf", "doc", "docx", "xls", "xlsx", "jpg", "jpeg", "png", "bmp", "tiff", "tif", "udf", "txt", "rtf", "csv", "xml", "zip", "rar"];
const upload_maxsize = 30;
const upload_maxfile = 50;

export const UploadBase = ({children, targetForm, onChange, name = "file__", required = true, multiple = false, maxSize = upload_maxsize, ext_ok = upload_ext_ok, style, refUploadInput = null, label}: Props) => {
    const ref = useRef<HTMLInputElement | null>(null);
    useEffect(() => {
        if (refUploadInput) refUploadInput.current = ref.current;
    }, [ref.current]);

    const fileSelected = (e: any) => {
        if (!(e.target.files.length > 0)) {
            e.target.value = null;
            return null;
        }
        if (e.target.files.length > upload_maxfile) {
            alert_add({type: 'error', message: 'En fazla ' + upload_maxfile + ' dosya seçebilirsiniz.'});
            e.target.value = null;
            return null;
        }

        const fileList: any = [];
        Object.values(e.target.files).map((file: any) => {
            const size = file.size;
            const ext = file.name.replace(/^.*\./, '').toLowerCase();

            if (ext_ok.indexOf(ext) === -1) {
                alert_add({type: 'error', message: "Yüklemeye çalıştığınız dosya türü desteklenmiyor. Desteklenen dosya türleri: " + ext_ok.join(", ")});
            } else if (size > (maxSize * 1000000)) {
                alert_add({type: 'error', message: "En fazla " + maxSize + "MB büyüklüğündeki dosyaları seçebilirsiniz."});
            } else {
                fileList.push(file);
            }
        });
        if (onChange) onChange(fileList);

        if (targetForm) {
            const nameList: string[] = [];
            let newform = {};
            let uniqueID = new Date().getTime();
            fileList.map((file: any) => {
                uniqueID = uniqueID + 1;
                newform = {...newform, [name + uniqueID]: file}
                nameList.push(file.name);
            })
            targetForm((prev: any) => ({
                ...prev,
                uploadBaseList: {...newform},
                uploadBaseListName: nameList.join(", ")
            }))
        }

    };


    return (
        <div style={{position: "relative", cursor: "pointer", ...style}} data-label={label ?? ""}>
            {children}
            <input
                ref={ref}
                type={"file"}
                required={required}
                onChange={fileSelected}
                multiple={multiple}
                accept={ext_ok.map((i: any) => "." + i).join(",")}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    opacity: 0,
                    width: "100%",
                    height: "100%",
                    cursor: "pointer",
                    zIndex: 1
                }}
            />
        </div>
    )
}


export const uploadBase_CreateForm = (formData: any) => {
    let newform = {...formData};
    const list = formData["uploadBaseList"] ?? {}
    Object.keys(list).map((fileKey: any) => newform = {...newform, [fileKey]: list[fileKey]})
    delete newform["uploadBaseList"];
    delete newform["uploadBaseListName"];
    return newform;
}