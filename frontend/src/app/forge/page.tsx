import { PageContainer } from '@/components/layout/wrappers/page-container';

export default function ForgePage() {
    return (
        <main className="bg-graphite min-h-[calc(100vh-56px)]">
            <PageContainer className="py-8">
                <h1 className="font-display text-3xl font-medium text-text-primary">
                    Your CVs
                </h1>
            </PageContainer>
        </main>
    );
}
