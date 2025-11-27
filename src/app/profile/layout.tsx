'use client';

import BackButton from '@/components/back-button/back';
import AvatarDisplayEditor from '@/components/profile-manager/avatar-editor';
import { Card } from '@/components/shadcn-components/card';
import PageWrapper from '@/components/wrappers/page-wrapper';
import { cn } from '@/lib/utils';
import { Lock, Trash2, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const sidebarItems = [
    {
        title: 'Edit Profile',
        href: '/profile/edit-profile',
        icon: User,
    },
    {
        title: 'Edit Password',
        href: '/profile/edit-password',
        icon: Lock,
    },
    {
        title: 'Delete Account',
        href: '/profile/delete-account',
        icon: Trash2,
    },
];

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <PageWrapper className="min-h-screen flex flex-col px-4 md:px-10">
            <div className="flex-1 flex flex-col w-full max-w-screen-2xl mx-auto">
                <div className="my-5">
                    <BackButton />
                </div>
                <Card className="flex-1 w-full h-full z-10 rounded-bl-none rounded-br-none flex flex-col md:flex-row overflow-hidden">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 flex flex-col border-b md:border-b-0 md:border-r bg-muted/10">
                        <div className="p-6 flex flex-col items-center border-b">
                            <AvatarDisplayEditor />
                        </div>
                        <nav className="flex flex-col sm:flex-row md:flex-col justify-center p-4 gap-2">
                            {sidebarItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            'flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                                            isActive
                                                ? 'bg-primary/10 text-primary'
                                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                        )}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        <span>{item.title}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </aside>

                    {/* Content */}
                    <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                        {children}
                    </main>
                </Card>
            </div>
        </PageWrapper>
    );
}
