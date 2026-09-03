'use client';

import { useState } from 'react';
import { useCvs } from '@/hooks/use-cvs';
import { CvCard } from './cv-card';
import { SkeletonCard } from '@/components/common/ui/skeleton-card';
import { EmptyState } from '@/components/common/ui/empty-state';
import { Button } from '@/ui/shadcn/button';
import { Input } from '@/ui/shadcn/input';
import { Search, X, FileText, SearchX } from 'lucide-react';
import Link from 'next/link';
import type { CvDocument } from '@/lib/types/cv-document-types';

export function CvGrid() {
    const { data: cvs = [], isLoading } = useCvs();
    const [search, setSearch] = useState('');

    const filtered = cvs.filter((cv: CvDocument) =>
        cv.title.toLowerCase().includes(search.toLowerCase())
    );

    const isFiltered = search !== '';
    const resultLabel = isFiltered
        ? `${filtered.length} of ${cvs.length}`
        : `${cvs.length} ${cvs.length === 1 ? 'CV' : 'CVs'}`;

    const clearSearch = () => setSearch('');

    return (
        <div className="space-y-6">
            <div className="border-b border-border-default pb-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-start">
                    <div className="flex-1 min-w-0" />
                    <div className="relative w-full md:w-56 shrink-0">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ash" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search CVs..."
                            className="pl-9 pr-9 bg-input-bg border-input-border text-input-text placeholder:text-input-placeholder"
                        />
                        {search && (
                            <button
                                onClick={clearSearch}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-ash hover:text-text-primary transition-colors"
                                aria-label="Clear search"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>
                {!isLoading && cvs.length > 0 && (
                    <p className="mt-3 text-right font-mono text-xs text-ash">
                        {resultLabel}
                    </p>
                )}
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            ) : cvs.length === 0 ? (
                <EmptyState
                    icon={<FileText className="h-10 w-10 text-ash/40" />}
                    message="No CVs yet. Start with a blank document or build one from your ingots."
                >
                    <Link href="/forge/cv/new">
                        <Button className="h-10 px-6 bg-flux hover:bg-flux-hover text-white font-medium rounded-md">
                            New CV
                        </Button>
                    </Link>
                </EmptyState>
            ) : filtered.length === 0 ? (
                <EmptyState
                    icon={<SearchX className="h-10 w-10 text-ash/40" />}
                    message="No CVs match your search."
                >
                    <button
                        onClick={clearSearch}
                        className="text-sm text-flux hover:text-flux-hover transition-colors"
                    >
                        Clear filters
                    </button>
                </EmptyState>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filtered.map((cv: CvDocument) => (
                        <CvCard key={cv.id} cv={cv} />
                    ))}
                </div>
            )}
        </div>
    );
}
