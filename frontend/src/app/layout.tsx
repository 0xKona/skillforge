'use client';

import { Inter, Space_Grotesk, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthListener } from '@/components/providers/auth-guard';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/ui/shadcn/sonner';
import QueryClientLayoutProvider from '@/components/providers/QueryClientProvider';
import { Header } from '@/components/layout/header';

const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin'],
    display: 'swap',
    preload: true,
});

const spaceGrotesk = Space_Grotesk({
    variable: '--font-space-grotesk',
    subsets: ['latin'],
    display: 'swap',
    preload: true,
    weight: ['400', '500', '600', '700'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
    display: 'swap',
    preload: true,
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark" suppressHydrationWarning>
            <body
                className={`${inter.variable} ${spaceGrotesk.variable} ${geistMono.variable} font-sans`}
            >
                <QueryClientLayoutProvider>
                    <AuthListener />
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <Header />
                        <Toaster />
                        {children}
                    </ThemeProvider>
                </QueryClientLayoutProvider>
            </body>
        </html>
    );
}
