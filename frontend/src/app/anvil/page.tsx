'use client';

import { PageContainer } from '@/components/layout/wrappers/page-container';
import { PageHeader } from '@/components/layout/wrappers/page-header';
import { IngotGrid } from '@/components/features/anvil/ingot-library';
import { Button } from '@/ui/shadcn/button';
import Link from 'next/link';

export default function AnvilPage() {
    return (
        <main className="bg-graphite min-h-[calc(100vh-56px)]">
            <PageContainer className="py-8">
                <PageHeader
                    title="Your Ingots"
                    subtitle="Reusable blocks for your CVs"
                    action={
                        <Link href="/anvil/create">
                            <Button className="h-10 px-4 bg-flux hover:bg-flux-hover text-white font-medium rounded-md">
                                New Ingot
                            </Button>
                        </Link>
                    }
                />
                <IngotGrid />
            </PageContainer>
        </main>
    );
}
