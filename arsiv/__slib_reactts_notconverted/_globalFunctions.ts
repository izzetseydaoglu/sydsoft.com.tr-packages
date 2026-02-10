/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 6.02.2024 23:45
 */

import {useEffect, useRef} from "react";
import isEqual from "lodash.isequal";
import HTMLReactParser from "html-react-parser";

export const isDev = (!process.env.NODE_ENV || process.env.NODE_ENV === "development");
export const uniqueID = (key = "", length = 16) => key + parseInt(Math.ceil(Math.random() * Date.now()).toPrecision(length).toString().replace(".", ""))
export const isEmptyObject = (obj = {}) => Object.keys(obj).length === 0;
export const isNull = (value: any) => typeof value === 'undefined' || value === null;
export const isString = (value: any) => typeof value === 'string' || value instanceof String;
export const isDateString = (value: any) => !isString(value) ? false : value.match(/^\d{4}-\d{2}-\d{2}$/);
export const isNumber = (value: any) => typeof value == 'number' && !isNaN(value);
export const isBoolean = (value: any) => value === true || value === false;

export const padNumber = (num: number, padLength = 2, padString = "0") => String(num).padStart(padLength, padString);

export const cevirTumuBuyuk = (text: any = "") => {
    if (!isString(text)) return text;
    return text.toString().toLocaleUpperCase("tr-TR")
}

export const cevirTumuKucuk = (text: any = "") => {
    if (!isString(text)) return text;
    return text.toString().toLocaleLowerCase("tr-TR")
}

export const convertForSearch = (value: string) => {
    let data = cevirTumuKucuk(value);
    data = data.replace(/ö/g, 'o');
    data = data.replace(/ç/g, 'c');
    data = data.replace(/ş/g, 's');
    data = data.replace(/ı/g, 'i');
    data = data.replace(/ğ/g, 'g');
    data = data.replace(/ü/g, 'u');
    data = data.replace(/[^a-z\d]/g, ""); // %_- are allowed
    data = data.replace(/^\s+|\s+$/g, "");
    return data;
};


export const cevir_array = (array: object[] = [], value: any, hedef = "value", istenen = "label") => {
    const r: any = array.find((item: any) => (convertForSearch(item[hedef].toString()) === convertForSearch(value.toString())))
    return (r) ? r[istenen] : "";
};

export const htmlClean = (html: any): any => {
    if (typeof document === 'undefined') return html;
    if (html) {
        const element = document.createElement('div');
        html = html.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
        html = html.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
        element.innerHTML = html;
        return element.textContent;
    }
    return "";
}

export function useDeepEffect(fn: any, deps: any) {
    const isFirst = useRef(true);
    const prevDeps = useRef(deps);

    useEffect(() => {
        const isSame = prevDeps.current.every((obj: any, index: any) => isEqual(obj, deps[index]));
        if (isFirst.current || !isSame) fn();
        isFirst.current = false;
        prevDeps.current = deps;
    }, deps);
}

export const htmlParser = (metin: any) => HTMLReactParser(metin);

export const detectOs = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    let operatingSystem;

    switch (true) {
        case userAgent.indexOf('windows') !== -1:
            operatingSystem = 'win';
            break;
        case userAgent.indexOf('mac') !== -1:
            operatingSystem = 'mac';
            break;
        case userAgent.indexOf('linux') !== -1:
            operatingSystem = 'linux';
            break;
        case userAgent.indexOf('android') !== -1:
            operatingSystem = 'android';
            break;
        case userAgent.indexOf('ios') !== -1:
            operatingSystem = 'ios';
            break;
        default:
            operatingSystem = 'win';
    }
    return operatingSystem;
}

export const validateEmail = (email: string) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};