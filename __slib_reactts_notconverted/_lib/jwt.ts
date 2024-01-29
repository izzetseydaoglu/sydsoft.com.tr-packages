/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 29.01.2024 04:09
 */

/**
 * DIKKAT, VERSIYON SORUNU
 * "jsonwebtoken": "8.5.1",
 * "@types/jsonwebtoken": "8.5.1"
 * Yukarıdaki sürümleri yükselttiğimizde proje hata veriyor, yeni versiyon uyarlaması yapılmalı.
 * Ancak güncelleme yapıldığında PHP tarafına da dikkat etmeliyiz.
 * */

import jwt from "jsonwebtoken";


export function signData(data: any): any {
    const {secretkey, alg, iss}: any = process.env.config_jwt;
    return jwt.sign(
        {
            // exp: Math.floor(Date.now() / 1000) + (60),
            // iat: Math.floor(Date.now() / 1000)-30,
            // nbf: Math.floor(Date.now() / 1000),
            iss: iss,
            data: data,
        },
        secretkey,
        {
            algorithm: alg
        }
    );
}

export function verifyData(token: any): any {
    const {secretkey, alg}: any = process.env.config_jwt;
    return jwt.verify(token, secretkey, {algorithms: [alg]}, (err, payload: any) => {
        if (err) {
            return false;
        }
        return payload.data;
    });
}

export function parseJwt(token: string) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}

export function encData(data: any) {
    const {secretkey}: any = process.env.config_jwt;
    const CryptoJS = require("crypto-js");
    return CryptoJS.AES.encrypt(data, secretkey).toString();
}

export function decData(encData: any) {
    try {
        const {secretkey}: any = process.env.config_jwt;
        const CryptoJS = require("crypto-js");
        const bytes = CryptoJS.AES.decrypt(encData, secretkey);
        return bytes.toString(CryptoJS.enc.Utf8)
    } catch {
        return false;
    }

}


