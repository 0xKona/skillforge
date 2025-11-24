import { TypographyH1 } from '@/components/ui/typography/typography';
import PageWrapper from '@/components/wrappers/page-wrapper';

export default async function LoginPage() {
    return (
        <PageWrapper className="flex items-start justify-center md:pt-20">
            <TypographyH1 className="text-slate-50">
                Welcome to the Forge
            </TypographyH1>
        </PageWrapper>
    );
}
