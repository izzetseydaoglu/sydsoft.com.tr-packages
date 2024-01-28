/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 29.01.2024 02:41
 */

/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: true,
    compiler: {
        styledComponents: true,
        removeConsole: {
            exclude: ['error'],
        },
    },
    swcMinify: true
};

export default nextConfig;
