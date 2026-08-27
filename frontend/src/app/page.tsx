import { PageContainer } from '@/components/layout/wrappers/page-container';
import { HomeHero } from '@/components/sections/home/hero';
import { HomeFeatures } from '@/components/sections/home/features';

export default function Home() {
    return (
        <main className="bg-graphite min-h-screen">
            <PageContainer>
                <HomeHero />
                <HomeFeatures />
            </PageContainer>
        </main>
    );
}
