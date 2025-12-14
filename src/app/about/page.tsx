import PageWrapper from '@/components/wrappers/page-wrapper';
import { AboutHero } from '@/components/about/about-hero';
import { AboutFeatures } from '@/components/about/about-features';
import { AboutHowItWorks } from '@/components/about/about-how-it-works';

export default async function AboutPage() {
    return (
        <PageWrapper className="flex flex-col min-h-screen bg-slate-950">
            <AboutHero />
            <AboutFeatures />
            <AboutHowItWorks />
        </PageWrapper>
    );
}
