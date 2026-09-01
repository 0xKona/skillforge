'use client';

import { PageContainer } from '@/components/layout/wrappers/page-container';
import { IngotGrid } from '@/components/features/anvil/ingot-library';
import { Button } from '@/ui/shadcn/button';
import Link from 'next/link';

export default function AnvilPage() {
    return (
        <main className="bg-graphite min-h-[calc(100vh-56px)]">
            <PageContainer className="py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="font-display text-3xl font-medium text-text-primary">
                        Your Ingots
                    </h1>
                    <Link href="/anvil/create">
                        <Button className="h-10 px-4 bg-flux hover:bg-flux-hover text-white font-medium rounded-md">
                            New Ingot
                        </Button>
                    </Link>
                </div>
                <IngotGrid />
            </PageContainer>
        </main>
    );
}
