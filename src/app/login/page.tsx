'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from 'aws-amplify/auth';
import AuthForm from '@/components/features/auth/auth-form';
import Logo from '@/components/common/icons/logo';
import PageWrapper from '@/components/layout/wrappers/page-wrapper';
import {
    TypographyH1,
    TypographyP,
} from '@/components/common/ui/typography/typography';
import { Skeleton } from '@/ui/shadcn/skeleton';

export default function LoginPage() {
    const router = useRouter();
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await getCurrentUser();
                // If successful, user is logged in
                router.replace('/forge');
            } catch {
                // Not logged in, show form
                setCheckingAuth(false);
            }
        };
        checkAuth();
    }, [router]);

    if (checkingAuth) {
        return (
            <PageWrapper className="min-h-screen flex items-start justify-center relative bg-gradient-to-br md:pt-20 from-slate-900 via-slate-800 to-slate-900">
                <div className="w-full max-w-md relative z-10 p-5 flex flex-col items-center space-y-8">
                    <Skeleton className="h-48 w-48 rounded-full" />
                    <div className="w-full space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </div>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper className="min-h-screen flex items-start justify-center relative bg-gradient-to-br md:pt-20 from-slate-900 via-slate-800 to-slate-900">
            <div className="w-full max-w-md relative z-10 p-5">
                <div className="text-center mb-8">
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <Logo
                                size={200}
                                color="var(--color-forge-orange)"
                                borderColor="#393939"
                                borderWidth={10}
                                className="drop-shadow-[0_0_30px_rgba(249,115,22,0.5)]"
                            />
                        </div>
                        <TypographyH1 className="text-4xl font-bold tracking-tight mb-2 text-white">
                            SkillForge
                        </TypographyH1>
                    </div>
                    <TypographyP className="text-gray-300">
                        Welcome! Please sign in to continue.
                    </TypographyP>
                </div>
                <AuthForm />
            </div>
        </PageWrapper>
    );
}
