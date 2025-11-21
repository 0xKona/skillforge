import type { Metadata } from 'next';
import { Inter, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Amplify } from 'aws-amplify';
import { amplifyConfig } from '@/configs/amplify.config';
import ConfigureAmplifyClientSide from '@/providers/configure-amplify-client';
import NavBar from '@/components/navigation-bar/navigation-bar';

const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin'],
    display: 'swap',
    preload: true,
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

// Configures Amplify on the server side of the application
Amplify.configure({ ...amplifyConfig }, { ssr: true });

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body
                className={`${inter.variable} ${geistMono.variable} antialiased font-sans bg-background text-foreground`}
            >
                <NavBar />
                <ConfigureAmplifyClientSide />
                {children}
            </body>
        </html>
    );
}
