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
