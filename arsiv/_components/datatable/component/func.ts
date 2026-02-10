/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 6.02.2024 23:45
 */

export const isEmptyObject = (obj = {}) => Object.keys(obj).length === 0;
export const isNull = (value: any) => typeof value === 'undefined' || value === null;
export const isString = (value: any) => typeof value === 'string' || value instanceof String;
export const isDateString = (value: any) => !isString(value) ? false : value.match(/^\d{4}-\d{2}-\d{2}$/);
export const isNumber = (value: any) => typeof value == 'number' && !isNaN(value);
export const isBoolean = (value: any) => value === true || value === false;

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

export function filterData(rows: any[], filters: { [key: string]: any }): any[] {
    if (isEmptyObject(filters)) {
        return rows;
    }

    return Object.values(rows).filter((row) => {
        return Object.keys(filters).every((field) => {
            const value = row[field]
            const operator = filters[field]["operator"];
            const searchValue = filters[field]["value"]

            if (isString(value)) {
                if (operator == "=") {
                    return value == searchValue;
                } else {
                    return convertForSearch(value).includes(convertForSearch(searchValue))
                }
            }

            if (isBoolean(value)) {
                return (searchValue === 'true' && value) || (searchValue === 'false' && !value)
            }

            if (isNumber(value)) {
                return value == searchValue
            }

            return false
        })
    })
}

export function sortData(rows: any[], order: "asc" | "desc", orderBy: string): any[] {
    function convertType(value: any) {
        if (isNumber(value)) {
            return value.toString()
        }

        if (isBoolean(value)) {
            return value ? '1' : '-1'
        }

        return value
    }

    // return rows.sort((a, b) => {
    return Object.values(rows).sort((a, b) => {

        if (isNull(a[orderBy])) return 1
        if (isNull(b[orderBy])) return -1

        const aLocale = convertType(a[orderBy])
        const bLocale = convertType(b[orderBy])

        if (order === 'asc') {
            return aLocale.localeCompare(bLocale, 'tr', {numeric: isNumber(b[orderBy])})
        } else {
            return bLocale.localeCompare(aLocale, 'tr', {numeric: isNumber(a[orderBy])})
        }
    })
}

export const paginateData = (data: any[], page: number, pageSize: number) => [...data].slice((page - 1) * pageSize, page * pageSize);