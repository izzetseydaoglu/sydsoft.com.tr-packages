/**
 * @author    : izzetseydaoglu
 * @copyright : sydSOFT Bilişim Hizmetleri (c) 2026
 * @version   : 2026-02-10 20:23:07
 */

import { decData, encData } from "./encData";

import { isDev } from "../baseFunctions";

const storageAvailable = typeof Storage === "undefined" || !window.sessionStorage ? false : true;

export const setSessionStorage = (key: string, value: any) => {
  if (!storageAvailable) return false;
  try {
    sessionStorage.setItem(key, encData(value));
    return true;
  } catch (e) {
    isDev && console.log("ERROR => SessionStorage =>", e);
    return false;
  }
};

export const getSessionStorage = (key: string) => {
  if (!storageAvailable) return false;
  try {
    const saved = sessionStorage.getItem(key);
    return saved ? decData(saved) : null;
  } catch (e) {
    isDev && console.log("ERROR => SessionStorage =>", e);
    return null;
  }
};
export const removeSessionStorage = (key: string) => {
  if (!storageAvailable) return false;
  try {
    sessionStorage.removeItem(key);
    return true;
  } catch (e) {
    isDev && console.log("ERROR => SessionStorage =>", e);
    return false;
  }
};

export const clearSessionStorage = () => {
  if (!storageAvailable) return false;
  try {
    sessionStorage.clear();
    return true;
  } catch (e) {
    isDev && console.log("ERROR => SessionStorage =>", e);
    return false;
  }
};

// Tüm SessionStorage anahtarlarını getir
export const getSessionStorageAllKeys = (): string[] => {
  if (!storageAvailable) return [];
  return Object.keys(sessionStorage);
};

// Tüm SessionStorage boyutunu getir
export const getSessionStorageSize = (): number => {
  if (!storageAvailable) return 0;

  let total = 0;
  for (const key in sessionStorage) {
    if (sessionStorage.hasOwnProperty(key)) {
      total += sessionStorage[key].length + key.length;
    }
  }
  return total;
};
