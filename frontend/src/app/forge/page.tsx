'use client';

import { PageContainer } from '@/components/layout/wrappers/page-container';
import { PageHeader } from '@/components/layout/wrappers/page-header';
import { CvGrid } from '@/components/features/forge/cv-library';
import { Button } from '@/ui/shadcn/button';
import Link from 'next/link';

export default function ForgePage() {
    return (
        <main className="bg-graphite min-h-[calc(100vh-56px)]">
            <PageContainer className="py-8">
                <PageHeader
                    title="Your CVs"
                    subtitle="Arrange your ingots into tailored CVs"
                    action={
                        <Link href="/forge/cv/new">
                            <Button className="h-10 px-4 bg-flux hover:bg-flux-hover text-white font-medium rounded-md">
                                New CV
                            </Button>
                        </Link>
                    }
                />
                <CvGrid />
            </PageContainer>
        </main>
    );
}
