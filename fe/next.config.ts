import type {NextConfig} from "next";

const prefix = process.env.NEXT_PUBLIC_MODE === 'prod' ? `${process.env.NEXT_PUBLIC_URL}` : ''

const nextConfig: NextConfig = {
    output: 'export',
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
