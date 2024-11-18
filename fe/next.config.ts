import type {NextConfig} from "next";

const isProd = process.env.NEXT_PUBLIC_MODE === 'prod';
const prefix = isProd ? `${process.env.NEXT_PUBLIC_URL}` : ''


const nextConfig: NextConfig = {
    ...(isProd ? {output: 'export', basePath: '/son-tracker', assetPrefix: prefix,} : {}),

    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'search.pstatic.net',
                port: '',
                pathname: '/**',
            }
        ]
    }
};

export default nextConfig;
