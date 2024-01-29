/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 29.01.2024 04:09
 */

import React, {useRef} from 'react';
import styled from "styled-components";
import PropTypes from "prop-types";

export const upload_ext_ok = ["pdf", "doc", "docx", "xls", "xlsx", "jpg", "jpeg", "png", "bmp", "tiff", "tif", "udf", "txt", "rtf", "csv", "xml", "zip", "rar"];
export const upload_maxsize = 30;
export const upload_maxfile = 50;

export default function ButtonUpload(props: any) {
    const {style, button, onChange, ext_ok, maxSize, multiple, ...other} = props;


    const fileSelected = (e: any) => {
        if (!(e.target.files.length > 0)) {
            e.target.value = null;
            return null;
        }
        if (e.target.files.length > upload_maxfile) {
            alert("En fazla " + upload_maxfile + " dosya seçebilirsiniz.");
            // alertEkle([ {sonuc : "error", mesaj : "Aynı anda en fazla " + upload_maxfile + " evrak yükleyebilirsiniz."} ]);
            e.target.value = null;
            return null;
        }

        const fileList: any = [];

        Object.values(e.target.files).map((file: any) => {
            const size = file.size;
            const ext = file.name.replace(/^.*\./, '').toLowerCase();

            if (ext_ok.indexOf(ext) === -1) {
                alert("Yüklemeye çalıştığınız dosya türü desteklenmiyor. Desteklenen dosya türleri: " + ext_ok.join(", "));
                // alertEkle([ {sonuc : "error", mesaj : "Sadece şu türdeki dosyaları seçebilirsiniz: " + ext_ok.join(", ")} ]);
            } else if (size > (maxSize * 1000000)) {
                // alertEkle([ {sonuc : "error", mesaj : "En fazla " + maxSize + "MB büyüklüğündeki dosyaları seçebilirsiniz."} ]);
                alert("En fazla " + maxSize + "MB büyüklüğündeki dosyaları seçebilirsiniz.");
            } else {
                fileList.push(file);
            }
        });
        if (onChange && fileList.length > 0) onChange(fileList);
        e.target.value = null;
    };


    const refUploadBtn = useRef<any>();
    return <SydUploadBase style={style} onClick={() => refUploadBtn.current.click()}>
        {button}
        <input className={"input"}
               ref={refUploadBtn}
               type={"file"}
               onChange={fileSelected}
               multiple={multiple}
               accept={ext_ok.map((i: any) => "." + i).join(",")}
               {...other}
        />
    </SydUploadBase>

};

ButtonUpload.propTypes = {
    button: PropTypes.any.isRequired,
    multiple: PropTypes.bool,
    ext_ok: PropTypes.array,
    maxSize: PropTypes.number,
    onChange: PropTypes.any,
    style: PropTypes.object,
};

ButtonUpload.defaultProps = {
    multiple: false,
    maxSize: upload_maxsize,
    ext_ok: upload_ext_ok
};


const SydUploadBase = styled.div`
  position: relative;

  .input {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    pointer-events: none;
  }
`;
