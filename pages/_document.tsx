/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 31.01.2024 02:50
 */

import Document, {DocumentContext, DocumentInitialProps, Head, Html, Main, NextScript} from "next/document";
import {ServerStyleSheet} from "styled-components";

export default class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext,): Promise<DocumentInitialProps> {
        const sheet = new ServerStyleSheet();
        const originalRenderPage = ctx.renderPage;

        try {
            ctx.renderPage = () =>
                originalRenderPage({
                    enhanceApp: (App) => (props) =>
                        sheet.collectStyles(<App {...props} />),
                });

            const initialProps = await Document.getInitialProps(ctx);
            return {
                ...initialProps,
                styles: [initialProps.styles, sheet.getStyleElement()],
            };
        } finally {
            sheet.seal();
        }
    }

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