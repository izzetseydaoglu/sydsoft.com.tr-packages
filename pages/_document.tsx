/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 29.01.2024 02:41
 */

import Document, {Head, Html, Main, NextScript} from "next/document";

export default class MyDocument extends Document {

    render() {
        return (
            <Html lang="tr">
                <Head>
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"/>
                    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>

                    <meta name="robots" content="all, index, follow"/>
                    <meta name="author" content="izzetseydaoglu"/>
                    <meta name="copyright" content="sydsoft.com.tr"/>
                    <meta name="distribution" content="Global"/>
                </Head>
                <body>
                <Main/>
                <NextScript/>
                </body>
            </Html>
        );
    }
}