import Logo from '@/components/icons/logo';
import BluePrintForgeBg from '@/components/ui/forge-bg';
import { Button } from '@/components/ui/shadcn/button';
import {
    TypographyH1,
    TypographyH3,
} from '@/components/ui/typography/typography';
import PageWrapper from '@/components/wrappers/page-wrapper';
import { isAuthenticated } from '@/utlils/amplify/server-utils';
import Link from 'next/link';

async function HeroSection() {
    const isLoggedIn = await isAuthenticated();

    return (
        <div className="flex flex-col items-center flex-1 gap-2">
            <div className="max-w-2xl w-full flex justify-center">
                <Logo size={200} color="#f97316" />
            </div>
            <TypographyH1 className="text-slate-50">
                Forge the Ultimate CV
            </TypographyH1>
            <TypographyH3 className="text-slate-400">
                Get started now
            </TypographyH3>
            <Button className="cursor-pointer" variant={'default'} size={'lg'}>
                {isLoggedIn ? (
                    <Link href={'/forge'}>Let&apos;s Go!</Link>
                ) : (
                    <Link href={'/login'}>Sign up now!</Link>
                )}
            </Button>
        </div>
    );
}

export default async function Home() {
    return (
        <PageWrapper>
            <div className="flex flex-col items-center font-sans min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
                <BluePrintForgeBg />
                <HeroSection />
            </div>
        </PageWrapper>
    );
}
