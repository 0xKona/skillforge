'use client';

import { AuthGuard } from '@/components/providers/auth-guard';
import { PageContainer } from '@/components/layout/wrappers/page-container';
import { PageHeader } from '@/components/layout/wrappers/page-header';
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
                    <PageHeader
                        title="Settings"
                        subtitle="Your account on SkillForge"
                    />
                    <div className="flex flex-col gap-6 md:flex-row md:gap-8">
                        <aside className="w-full shrink-0 md:w-56">
                            <ProfileTabs />
                        </aside>
                        <div className="min-w-0 flex-1">{children}</div>
                    </div>
                </PageContainer>
            </main>
        </AuthGuard>
    );
}
