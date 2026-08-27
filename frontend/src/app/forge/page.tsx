'use client';

import { PageContainer } from '@/components/layout/wrappers/page-container';
import { CvGrid } from '@/components/features/forge/cv-library';
import { Button } from '@/ui/shadcn/button';
import Link from 'next/link';

export default function ForgePage() {
    return (
        <main className="bg-graphite min-h-[calc(100vh-56px)]">
            <PageContainer className="py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="font-display text-3xl font-medium text-text-primary">
                        Your CVs
                    </h1>
                    <Link href="/forge/cv/new">
                        <Button className="h-10 px-4 bg-flux hover:bg-flux-hover text-white font-medium rounded-md">
                            New CV
                        </Button>
                    </Link>
                </div>
                <CvGrid />
            </PageContainer>
        </main>
    );
}
