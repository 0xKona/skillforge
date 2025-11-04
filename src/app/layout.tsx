import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Amplify } from 'aws-amplify';
import { amplifyConfig } from '@/configs/amplify.config';
import ConfigureAmplifyClientSide from '@/providers/configure-amplify-client';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    icons: {
        icon: [{ url: '/logo_favicon.svg', type: 'image/svg+xml' }],
    },
    title: 'SkillForge',
    description: 'Create and manage modular CVs!',
};

// Confiures Amplify on the server side of the application
Amplify.configure({ ...amplifyConfig }, { ssr: true });

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <ConfigureAmplifyClientSide />
                {children}
            </body>
        </html>
    );
}
