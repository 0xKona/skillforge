'use client';

import { useCvs } from '@/hooks/use-cvs';
import { CvCard } from './cv-card';
import { SkeletonCard } from '@/components/common/ui/skeleton-card';
import { EmptyState } from '@/components/common/ui/empty-state';
import { Button } from '@/ui/shadcn/button';
import Link from 'next/link';

export function CvGrid() {
    const { data: cvs = [], isLoading } = useCvs();

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        );
    }

    if (cvs.length === 0) {
        return (
            <EmptyState message="No CVs yet. Start with a blank document or import from your ingots.">
                <Link href="/forge/cv/new">
                    <Button className="h-10 px-6 bg-flux hover:bg-flux-hover text-white font-medium rounded-md">
                        New CV
                    </Button>
                </Link>
            </EmptyState>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cvs.map((cv) => (
                <CvCard key={cv.id} cv={cv} />
            ))}
        </div>
    );
}
