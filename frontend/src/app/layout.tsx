'use client';

import { Inter, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthListener } from '@/components/providers/auth-guard';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/ui/shadcn/sonner';
import QueryClientLayoutProvider from '@/components/providers/QueryClientProvider';

const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin'],
    display: 'swap',
    preload: true,
    weight: ['400', '500', '600', '700', '800'],
    style: ['normal', 'italic'],
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
                className={`${inter.variable} ${geistMono.variable} antialiased font-sans bg-background text-foreground`}
            >
                <QueryClientLayoutProvider>
                    <AuthListener />
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <Toaster />
                        {children}
                    </ThemeProvider>
                </QueryClientLayoutProvider>
            </body>
        </html>
    );
}
