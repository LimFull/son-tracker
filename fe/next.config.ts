import type {NextConfig} from "next";


const nextConfig: NextConfig = {
    output: 'export',
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
