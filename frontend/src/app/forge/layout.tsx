import PageWrapper from '@/components/layout/wrappers/page-wrapper';
import { AuthGuard } from '@/components/providers/auth-guard';

export default function ForgeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <PageWrapper className="flex flex-col items-start justify-start relative md:pt-10 md:px-5">
                <div className="flex-1 flex flex-col w-full max-w-screen-2xl mx-auto z-10">
                    {children}
                </div>
            </PageWrapper>
        </AuthGuard>
    );
}
