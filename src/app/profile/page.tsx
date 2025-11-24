'use client';

import BackButton from '@/components/back-button/back';
import PageWrapper from '@/components/wrappers/page-wrapper';
import { useAuth } from '@/hooks/use-auth';

export default function UserManagementPage() {
    const { userId, userAttributes, loading, error, signOut } = useAuth();

    return (
        <PageWrapper className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <BackButton />
            <h1>User Management</h1>
        </PageWrapper>
    );
}
