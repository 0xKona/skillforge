import type { Metadata } from 'next';
import { Inter, Geist_Mono } from 'next/font/google';
import './globals.css';
import ConfigureAmplifyClientSide from '@/components/providers/configure-amplify-client';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ClientAuthListener } from '@/components/providers/client-auth-listener';
import { Toaster } from '@/ui/shadcn/sonner';

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

export const metadata: Metadata = {
    icons: {
        icon: [{ url: '/logo_favicon.svg', type: 'image/svg+xml' }],
    },
    title: 'SkillForge',
    description: 'Create and manage modular CVs!',
};

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
                <ConfigureAmplifyClientSide />
                <ClientAuthListener />
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    <Toaster />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
