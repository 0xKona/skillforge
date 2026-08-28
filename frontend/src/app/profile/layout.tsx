'use client';

import { AuthGuard } from '@/components/providers/auth-guard';
import { PageContainer } from '@/components/layout/wrappers/page-container';
import { ProfileTabs } from '@/components/features/profile/profile-tabs';

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <main className="bg-graphite min-h-[calc(100vh-56px)]">
                <PageContainer className="py-8">
                    <h1 className="font-display text-3xl font-medium text-text-primary mb-8">
                        Settings
                    </h1>
                    <div className="flex flex-col md:flex-row gap-8">
                        <aside className="w-full md:w-48 shrink-0">
                            <ProfileTabs />
                        </aside>
                        <div className="flex-1 min-w-0">{children}</div>
                    </div>
                </PageContainer>
            </main>
        </AuthGuard>
    );
}
