'use client';

import { useState } from 'react';
import { useIngots } from '@/hooks/use-ingots';
import { IngotCard } from './ingot-card';
import { TypeFilter } from './type-filter';
import { SkeletonCard } from '@/components/common/ui/skeleton-card';
import { EmptyState } from '@/components/common/ui/empty-state';
import { Button } from '@/ui/shadcn/button';
import { Input } from '@/ui/shadcn/input';
import { Search, X, Layers, SearchX } from 'lucide-react';
import Link from 'next/link';
import type { Ingot } from '@/lib/types/ingot-types';
import { mappingHelpers } from '@/lib/helpers/mapping';

export function IngotGrid() {
    const { data: ingots = [], isLoading } = useIngots();
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('ALL');

    const filtered = ingots.filter((ingot: Ingot) => {
        const matchesSearch = ingot.name
            .toLowerCase()
            .includes(search.toLowerCase());
        const matchesType = typeFilter === 'ALL' || ingot.type === typeFilter;
        return matchesSearch && matchesType;
    });

    const isFiltered = search !== '' || typeFilter !== 'ALL';

    const resultLabel = isFiltered
        ? `${filtered.length} of ${ingots.length}`
        : `${ingots.length} ${ingots.length === 1 ? 'ingot' : 'ingots'}`;

    const clearFilters = () => {
        setSearch('');
        setTypeFilter('ALL');
    };

    const activeFilterName =
        typeFilter !== 'ALL'
            ? mappingHelpers.getIngotLabel(
                  typeFilter as Parameters<
                      typeof mappingHelpers.getIngotLabel
                  >[0]
              )
            : null;

    return (
        <div className="space-y-6">
            {/* Filter toolbar */}
            <div className="border-b border-border-default pb-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-start">
                    <div className="flex-1 min-w-0">
                        <TypeFilter
                            active={typeFilter}
                            onChange={setTypeFilter}
                        />
                    </div>
                    <div className="relative w-full md:w-56 shrink-0">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ash" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search ingots..."
                            className="pl-9 pr-9 bg-input-bg border-input-border text-input-text placeholder:text-input-placeholder"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-ash hover:text-text-primary transition-colors"
                                aria-label="Clear search"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>
                {!isLoading && ingots.length > 0 && (
                    <p className="mt-3 text-right font-mono text-xs text-ash">
                        {resultLabel}
                    </p>
                )}
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            ) : ingots.length === 0 ? (
                <EmptyState
                    icon={<Layers className="h-10 w-10 text-ash/40" />}
                    message="Your ingot library is empty. Ingots are reusable blocks — experience, skills, education — that you arrange into CVs."
                >
                    <Link href="/anvil/create">
                        <Button className="h-10 px-6 bg-flux hover:bg-flux-hover text-white font-medium rounded-md">
                            New Ingot
                        </Button>
                    </Link>
                </EmptyState>
            ) : filtered.length === 0 ? (
                <EmptyState
                    icon={<SearchX className="h-10 w-10 text-ash/40" />}
                    message={`No${activeFilterName ? ` ${activeFilterName}` : ''} ingots match your search.`}
                >
                    <button
                        onClick={clearFilters}
                        className="text-sm text-flux hover:text-flux-hover transition-colors"
                    >
                        Clear filters
                    </button>
                </EmptyState>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((ingot: Ingot) => (
                        <IngotCard key={ingot.id} ingot={ingot} />
                    ))}
                </div>
            )}
        </div>
    );
}
