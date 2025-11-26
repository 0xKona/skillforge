'use client';

import BackButton from '@/components/back-button/back';
import AvatarDisplayEditor from '@/components/profile-manager/avatar-editor';
import { Card } from '@/components/shadcn-components/card';
import PageWrapper from '@/components/wrappers/page-wrapper';
import React from 'react';

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <PageWrapper className="min-h-screen flex flex-col px-10">
            <div className="my-5">
                <BackButton />
            </div>
            <Card className="flex-1 p-6 w-full h-full z-10 rounded-bl-none rounded-br-none">
                <AvatarDisplayEditor />
                <h1>User Management</h1>
                {children}
            </Card>
        </PageWrapper>
    );
}
