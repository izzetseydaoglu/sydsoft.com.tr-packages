/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 29.01.2024 04:09
 */
import {storeClone} from "@/_sredux";
import {decData, encData} from "@/_slib_reactts/_lib/jwt";
import {isDev} from "@/_slib_reactts/_globalFunctions";


export const getSessionStorage = (key: string) => {
    try {
        if (typeof window !== "undefined") {
            const versiyon = storeClone.getState().site.storageVersiyon;
            const saved = sessionStorage.getItem(key + versiyon);
            return saved !== null ? JSON.parse(decData(saved)) : null;
        }
        return null;
    } catch (e) {
        isDev && console.error("getStorage error: ", key, e);
        return null;
    }
};

export const setSessionStorage = (key: string, value: any) => {
    try {
        const versiyon = storeClone.getState().site.storageVersiyon;
        sessionStorage.setItem(key + versiyon, encData(JSON.stringify(value)));
        return true;
    } catch (e) {
        isDev && console.error("setStorage error: ", key, e);
        return false;
    }
};

export const clearSessionStorage = () => {
    try {
        sessionStorage.clear();
        return true;
    } catch (e) {
        return false;
    }
};