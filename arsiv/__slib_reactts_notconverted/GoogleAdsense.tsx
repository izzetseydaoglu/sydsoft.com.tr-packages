/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 29.01.2024 04:09
 */

import {useEffect, useState} from 'react';
import styled from "styled-components";
import {useRouter} from "next/router";
import {isDev} from "@/_slib_reactts/_globalFunctions";

declare global {
    interface Window {
        adsbygoogle: { [key: string]: unknown }[]
    }
}

// export enum AdType {
//     FIXED,
//     RESPONSIVE,
//     FEED,
//     ARTICLE
// }
//
//
// const adUnitProps: Record<AdType, any> = {
//     [AdType.FIXED]: {},
//     [AdType.RESPONSIVE]: {
//         'style': 'display:block',
//         'data-ad-format': 'auto',
//         'data-full-width-responsive': 'true',
//     },
//     [AdType.FEED]: {
//         'style': 'display:block',
//         'data-ad-format': 'fluid',
//         'data-ad-layout': 'in-article',
//     },
//     [AdType.ARTICLE]: {
//         'style': 'display:block; text-align:center;',
//         'data-ad-format': 'fluid',
//         'data-ad-layout': 'in-article',
//     }
// };

export interface GoogleAdProps {
    className?: string,
    styleComponent?: object,
    styleAdsense?: object,
}

export function GoogleAdsense({className, styleAdsense, styleComponent, ...other}: GoogleAdProps) {
    const router = useRouter()
    const [refresh, setRefresh] = useState<number>(Math.random());
    useEffect(() => {
        const handleRouteChange = () => setRefresh(Math.random());
        router.events.on('routeChangeComplete', handleRouteChange)
        return () => router.events.off('routeChangeComplete', handleRouteChange)
    }, [router.events])

    useEffect(() => {
        try {
            if (typeof window !== "undefined" && !isDev) {
                window.adsbygoogle = window.adsbygoogle || [];
                window.adsbygoogle.push({});
            }
        } catch (err) {
            console.error(err);
        }
    }, [refresh]);


    return (
        <MainBaseAdsense
            key={refresh}
            className={className}
            style={styleComponent}
            aria-hidden={true}
        >
            <ins
                className="adsbygoogle"
                data-ad-client={process.env.googleadsense}
                style={styleAdsense}
                {...other}
            />
        </MainBaseAdsense>
    );
}

const MainBaseAdsense = styled.div`
  background: #f7f7f7;
  overflow: hidden;
  padding: 5px;
  text-align: center;
`