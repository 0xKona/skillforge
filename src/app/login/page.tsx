'use client';

import AuthForm from '@/components/features/auth/auth-form';
import Logo from '@/components/common/icons/logo';
import PageWrapper from '@/components/layout/wrappers/page-wrapper';
import {
    TypographyH1,
    TypographyP,
} from '@/components/common/ui/typography/typography';

/**
 * Login Page
 *
 * Note: Auth state checking and redirects are handled by ClientAuthListener.
 * This component simply renders the login form. If the user is already
 * authenticated, ClientAuthListener will redirect them to /forge.
 */
export default function LoginPage() {
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
