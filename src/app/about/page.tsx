import PageWrapper from '@/components/layout/wrappers/page-wrapper';
import { AboutHero } from '@/components/sections/about/about-hero';
import { AboutFeatures } from '@/components/sections/about/about-features';
import { AboutHowItWorks } from '@/components/sections/about/about-how-it-works';

export default async function AboutPage() {
    return (
        <PageWrapper className="flex flex-col min-h-screen bg-slate-950">
            <AboutHero />
            <AboutFeatures />
            <AboutHowItWorks />
        </PageWrapper>
    );
}
