/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 29.01.2024 02:41
 */

/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: false,
    compiler: {
        styledComponents: true,
    },
    swcMinify: true,
    transpilePackages: ['@sydsoft/base']
};

export default nextConfig;
