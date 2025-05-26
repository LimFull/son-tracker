import next_pwa from "next-pwa";

const isProd = process.env.NEXT_PUBLIC_MODE === "prod";
const prefix = isProd ? `${process.env.NEXT_PUBLIC_URL}` : "";

const withPWA = next_pwa({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: !isProd, // dev 모드에선 꺼두기
});

console.log("isProd", isProd);
const nextConfig = {
    output: "export" as "export" | undefined,
    assetPrefix: isProd ? prefix : '',
    basePath: isProd ? '/son-tracker' : '',
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: "https" as "https" | "http",
                hostname: "search.pstatic.net",
                // port: "",
                pathname: "/**",
            },
        ],
    },
};

export default withPWA(nextConfig);
