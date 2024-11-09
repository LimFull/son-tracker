import type {Metadata} from "next";
import localFont from "next/font/local";
import "./globals.css";
import {Providers} from "@/components/modules/Providers";

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
};


export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={'h-full'}>
        <body
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
        <Providers>
            {children}
        </Providers>
        </body>
        </html>
    );
}
