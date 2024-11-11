import type {NextConfig} from "next";

const isProd = process.env.NEXT_PUBLIC_MODE === 'prod';
const prefix = isProd ? `${process.env.NEXT_PUBLIC_URL}` : ''

const nextConfig: NextConfig = {
    ...(isProd ? {output: 'export'} : {}),
    assetPrefix: prefix,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdne-totv8-prod-southeastasia.azureedge.net',
                port: '',
                pathname: '/**',
            }
        ]
    }
};

export default nextConfig;
