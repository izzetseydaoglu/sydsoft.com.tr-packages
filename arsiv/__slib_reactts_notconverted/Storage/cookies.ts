/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 29.01.2024 04:09
 */

import nookies, {destroyCookie, parseCookies, setCookie} from "nookies";


export const cerezKaydet = (context: any | null = null, key: string, value: string, time: number = 0, config: any = process.env.cookie) => {
    const newConfig = cookieNetlifyCheck(context, config);
    setCookie(context, key, value, {
        maxAge: (time > 0) ? time : null,
        ...newConfig
    });
};

export const cerezOku = (context: any | null = null, key: string) => {
    const cookies = (context) ? nookies.get(context) : parseCookies();
    return cookies [key] || false;
};


export const cerezSil = (context: any | null = null, key: string, config: object | any = process.env.cookie) => {
    const newConfig = cookieNetlifyCheck(context, config);
    destroyCookie(context, key, newConfig);
};


export const cerezTumuSil = (context: any | null = null, config: object | any = process.env.cookie) => {
    const cookies = parseCookies(context);
    if (cookies) {
        Object.keys(cookies).forEach((key) => {
            destroyCookie(context, key);
            destroyCookie(context, key, config);
        });
    }
};


export const cookieNetlifyCheck = (context: any | null = null, config: any = {}) => {
    const hostname = (context) ? context.req.headers.host : (typeof window === "undefined" ? config.domain : window.location.hostname);
    const domain = (hostname.includes("netlify")) ? "netlify.app" : config.domain || "";
    return {
        ...config,
        domain
    }
};