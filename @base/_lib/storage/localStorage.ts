import { decData, encData } from "./encData";

import { isDev } from "../baseFunctions";

const storageAvailable = typeof Storage === "undefined" || !window.localStorage ? false : true;

export const setLocalStorage = (key: string, value: any) => {
  if (!storageAvailable) return false;
  try {
    localStorage.setItem(key, encData(value));
    return true;
  } catch (e) {
    isDev && console.log("ERROR => localStorage =>", e);
    return false;
  }
};

export const getLocalStorage = (key: string) => {
  if (!storageAvailable) return false;
  try {
    const saved = localStorage.getItem(key);
    return saved ? decData(saved) : null;
  } catch (e) {
    isDev && console.log("ERROR => localStorage =>", e);
    return null;
  }
};
export const removeLocalStorage = (key: string) => {
  if (!storageAvailable) return false;
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    isDev && console.log("ERROR => localStorage =>", e);
    return false;
  }
};

export const clearLocalStorage = () => {
  if (!storageAvailable) return false;
  try {
    localStorage.clear();
    return true;
  } catch (e) {
    isDev && console.log("ERROR => localStorage =>", e);
    return false;
  }
};

// Tüm localStorage anahtarlarını getir
export const getLocalStorageAllKeys = (): string[] => {
  if (!storageAvailable) return [];
  return Object.keys(localStorage);
};

// Tüm localStorage boyutunu getir
export const getLocalStorageSize = (): number => {
    if (!storageAvailable) return 0;
    
    let total = 0;
    for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            total += localStorage[key].length + key.length;
        }
    }
    return total;
};