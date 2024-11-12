import type {NextConfig} from "next";
import nextPwa from 'next-pwa';

const isProd = process.env.NEXT_PUBLIC_MODE === 'prod';
const prefix = isProd ? `${process.env.NEXT_PUBLIC_URL}` : ''
const withPWA = nextPwa({dest:'public'})


const nextConfig: NextConfig = {
    ...(isProd ? {output: 'export', basePath: '/son-tracker'} : {}),
    assetPrefix: prefix,
    images: {
        unoptimized: true,
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

export default withPWA(nextConfig);
