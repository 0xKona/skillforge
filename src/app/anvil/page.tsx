import BluePrintForgeBg from '@/components/ui/forge-bg';
import { TypographyH1 } from '@/components/ui/typography/typography';
import PageWrapper from '@/components/wrappers/page-wrapper';

export default async function LoginPage() {
    return (
        <PageWrapper>
            <main className="min-h-screen flex items-start justify-center relative bg-gradient-to-br md:pt-20 from-slate-900 via-slate-800 to-slate-900">
                <BluePrintForgeBg />
                <TypographyH1 className="text-slate-50">
                    Welcome to the Anvil
                </TypographyH1>
            </main>
        </PageWrapper>
    );
}
