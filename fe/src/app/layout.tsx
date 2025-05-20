import type {Metadata} from "next";
import localFont from "next/font/local";
import "./globals.css";
import {Providers} from "@/components/modules/Providers";
import {isProd} from "@/constants/env";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "Son Tracker",
    description: "track matches and push notification",
    manifest: `${isProd ? '/son-tracker' : ''}/manifest.json`,
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const manifestHref = isProd ? "/son-tracker/manifest.json" : '/manifest.json';
    const appleTouchIcon = isProd ? "/son-tracker/icon512_rounded.png" : '/icon512_rounded.png';

    return (
        <html lang="en" className={"h-full"}>
        <head>
            {/* manifest 연결 */}
            <link rel="manifest" href={manifestHref}/>

            {/* iOS 전용 아이콘 */}
            <link rel="apple-touch-icon" href={appleTouchIcon}/>

            {/* iOS PWA 설정 */}
            <meta name="apple-mobile-web-app-capable" content="yes"/>
            <meta name="apple-mobile-web-app-status-bar-style" content="default"/>
            <meta name="apple-mobile-web-app-title" content="son tracker"/>

            {/* PWA 색상 */}
            <meta name="theme-color" content="#8936FF"/>
        </head>
        <body
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
        <Providers>{children}</Providers>
        </body>
        </html>
    );
}
