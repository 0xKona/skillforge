'use client';

import { useState } from 'react';
import { useIngots } from '@/hooks/use-ingots';
import { IngotCard } from './ingot-card';
import { TypeFilter } from './type-filter';
import { SkeletonCard } from '@/components/common/ui/skeleton-card';
import { EmptyState } from '@/components/common/ui/empty-state';
import { Button } from '@/ui/shadcn/button';
import { Input } from '@/ui/shadcn/input';
import { Search } from 'lucide-react';
import Link from 'next/link';
import type { Ingot } from '@/lib/types/ingot-types';

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

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <TypeFilter active={typeFilter} onChange={setTypeFilter} />
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ash" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search ingots..."
                        className="pl-9 bg-input-bg border-input-border text-input-text placeholder:text-input-placeholder"
                    />
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            ) : ingots.length === 0 ? (
                <EmptyState message="Your ingot library is empty. Ingots are reusable blocks — experience, skills, education — that you arrange into CVs.">
                    <Link href="/anvil/create">
                        <Button className="h-10 px-6 bg-flux hover:bg-flux-hover text-white font-medium rounded-md">
                            New Ingot
                        </Button>
                    </Link>
                </EmptyState>
            ) : filtered.length === 0 ? (
                <EmptyState
                    message={`No ${typeFilter === 'ALL' ? '' : typeFilter.replace('ingot_', '')} ingots.`}
                />
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
