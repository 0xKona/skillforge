import PageWrapper from '@/components/wrappers/page-wrapper';
import { isAuthenticated } from '@/lib/amplify/server-utils';
import { HomeHero } from '@/components/home/home-hero';
import { AboutFeatures } from '@/components/about/about-features';
import { HomeLearnMore } from '@/components/home/home-learn-more';
import {
    TypographyH2,
    TypographyP,
} from '@/components/ui/typography/typography';

export default async function Home() {
    const isLoggedIn = await isAuthenticated();

    return (
        <PageWrapper className="flex flex-col min-h-screen bg-slate-950">
            <HomeHero isLoggedIn={isLoggedIn} />

            <div className="py-24 border-y border-slate-800/50 bg-slate-900/20">
                <div className="text-center mb-12 px-6">
                    <TypographyH2 className="text-3xl md:text-4xl font-bold text-slate-100 border-none mb-4">
                        The SkillForge Ecosystem
                    </TypographyH2>
                    <TypographyP className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Everything you need to build the perfect CV, all in one
                        place.
                    </TypographyP>
                </div>
                <AboutFeatures />
            </div>

            <HomeLearnMore />
        </PageWrapper>
    );
}
