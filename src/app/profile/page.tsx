'use client';

import BackButton from '@/components/back-button/back';
import AvatarDisplayEditor from '@/components/profile-manager/avatar-editor';
import { Card } from '@/components/shadcn-components/card';
import PageWrapper from '@/components/wrappers/page-wrapper';
import { useAuth } from '@/hooks/use-auth';
import { useGlobalAvatar } from '@/lib/store/global-avatar';
import React from 'react';

export default function UserManagementPage() {
    return (
        <PageWrapper className="min-h-screen flex flex-col px-10">
            <div className="my-5">
                <BackButton />
            </div>
            <ManagerContents />
        </PageWrapper>
    );
}

function ManagerContents() {
    const { userId, userAttributes, loading, error, signOut } = useAuth();

    const { avatarUrl, setAvatarUrl } = useGlobalAvatar();

    React.useEffect(() => {
        const authPicture = userAttributes?.picture as string;
        // Only update the store if the picture exists AND is different from what we have
        // This prevents infinite re-render loops
        if (authPicture && authPicture !== avatarUrl) {
            setAvatarUrl(authPicture);
        }
    }, [userAttributes, avatarUrl, setAvatarUrl]);

    console.log('AMPLIFY USER: ', userAttributes);

    console.log('State Image: ', avatarUrl);

    return (
        <Card className="flex-1 p-6 w-full h-full z-10 rounded-bl-none rounded-br-none">
            <AvatarDisplayEditor />
            <h1>User Management</h1>
        </Card>
    );
}
