import { isDev } from "@sydsoft/base";

const keys: number[] = [3, 5, 8, 11, 15, 22];

export const encData = (data: any) => {
  try {
    const utf8Data = unescape(encodeURIComponent(JSON.stringify(data))); // Dizeyi UTF-8'e dönüştür
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

export const decData = (data: string) => {
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

    return JSON.parse(utf8DecodedString);
  } catch (e) {
    isDev && console.log("ERROR => decData =>", e);
    return "";
  }
};
