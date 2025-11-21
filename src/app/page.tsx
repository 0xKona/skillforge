import Logo from '@/components/icons/logo';
import BluePrintForgeBg from '@/components/ui/blueprint-forge-bg';
import { Button } from '@/components/ui/shadcn/button';
import {
    TypographyH1,
    TypographyH3,
} from '@/components/ui/typography/typography';
import Link from 'next/link';

export default async function Home() {
    return (
        <div className="flex flex-col items-center justify-center font-sans min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
            <BluePrintForgeBg />

            {/* Main content area */}
            <div className="flex flex-col items-center flex-1 gap-2">
                <div className="max-w-2xl w-full flex justify-center">
                    <Logo size={200} color="#f97316" />
                </div>
                <TypographyH1>Forge the Ultimate CV</TypographyH1>
                <TypographyH3 className="text-[#d1d5db]">
                    Get started now
                </TypographyH3>
                <Button
                    className="cursor-pointer"
                    variant={'default'}
                    size={'lg'}
                >
                    <Link href={'/login'}>Sign up now!</Link>
                </Button>
            </div>

            <footer className="flex gap-6 flex-wrap items-center justify-center">
                <div className="h-12 w-12 bg-muted rounded" />
            </footer>
        </div>
    );
}
