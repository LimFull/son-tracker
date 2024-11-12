import type {NextConfig} from "next";
import withPWA from '@ducanh2912/next-pwa';

const isProd = process.env.NEXT_PUBLIC_MODE === 'prod';
const prefix = isProd ? `${process.env.NEXT_PUBLIC_URL}` : ''


const nextConfig: NextConfig ={
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

export default withPWA({...nextConfig, dest:'public'});
