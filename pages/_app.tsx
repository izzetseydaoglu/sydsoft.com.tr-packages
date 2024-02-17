/**
 * Copyright (c) 2024
 *  @author: izzetseydaoglu
 *  @last-modified: 18.02.2024 02:14
 */

import "@/styles/globals.css";
import type {AppProps} from "next/app";
import Head from "next/head";
import React from "react";
import {Alert} from "@/_components/alert/component";

export default function App({Component, pageProps}: AppProps) {
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
                <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
                <meta httpEquiv="content-type" content="text/html; charset=utf-8"/>
            </Head>
            <Component {...pageProps} />
            <Alert defaultTimer={"8000"} defaultErrorTimer={"10000"} defaultSuccessTimer={"6000"}/>
        </>
    );
}
