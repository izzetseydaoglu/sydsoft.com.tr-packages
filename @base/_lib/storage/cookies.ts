/**
 * @author    : izzetseydaoglu
 * @copyright : sydSOFT Bilişim Hizmetleri (c) 2026
 * @version   : 2026-02-10 20:23:07
 */

import nookies, { destroyCookie, parseCookies, setCookie } from 'nookies';

import { getDomain } from '../baseFunctions';

export const cerezOku = (context: any | null = null, key: string) => {
    const cookies = context ? nookies.get(context) : parseCookies();
    return cookies[key] || false;
};

export const cerezKaydet = (context: any | null = null, key: string, value: string, time: number = 0) => {
    const newConfig = checkDomain(context);
    setCookie(context, key, value, {
        maxAge: time > 0 ? time : null,
        ...newConfig
    });
};

export const cerezSil = (context: any | null = null, key: string) => {
    const newConfig = checkDomain(context);
    destroyCookie(context, key, newConfig);
};

export const cerezTumuSil = (context: any | null = null) => {
    const cookies = parseCookies(context);
    if (cookies) {
        Object.keys(cookies).forEach((key) => {
            destroyCookie(context, key);
        });
    }
};

const checkDomain = (context: any | null = null, config: any = {}) => {
    let cookieDomain = getDomain(context);
    return {
        ...config,
        domain: '.' + cookieDomain,
        path: '/'
    };
};
