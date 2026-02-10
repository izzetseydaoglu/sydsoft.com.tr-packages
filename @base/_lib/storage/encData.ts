/**
 * @author    : izzetseydaoglu
 * @copyright : sydSOFT Bilişim Hizmetleri (c) 2026
 * @version   : 2026-02-10 20:23:07
 */

import { isDev } from "../baseFunctions";

const encDecDataKeys: number[] = [3, 5, 8, 11, 15, 22];

export const encData = (data: object | string | number, keys: number[] = encDecDataKeys) => {
  try {
    const newJSON = { data: data };
    const utf8Data = unescape(encodeURIComponent(JSON.stringify(newJSON))); // Dizeyi UTF-8'e dönüştür
    let newData = btoa(utf8Data);
    keys.map((value) => {
      const randomChar = String.fromCharCode(Math.floor(Math.random() * (122 - 97 + 1)) + 97);
      newData = newData.slice(0, value) + randomChar + newData.slice(value);
    });
    return newData;
  } catch (e) {
    isDev && console.log("ERROR => encData =>", e);
    return "";
  }
};

export const decData = (data: string, keys: number[] = encDecDataKeys) => {
  try {
    let decode = data;
    keys.map((value, index) => {
      const prevValue = keys[index - 1];
      if (!prevValue) {
        decode = decode.slice(0, value) + decode.slice(value + 1);
      } else {
        decode = decode.slice(0, value - index) + decode.slice(value - index + 1);
      }
    });
    const decodedString = atob(decode);
    const utf8DecodedString = decodeURIComponent(escape(decodedString));

    const parse = JSON.parse(utf8DecodedString);
    return parse?.data ?? "";
  } catch (e) {
    isDev && console.log("ERROR => decData =>", e);
    return "";
  }
};
