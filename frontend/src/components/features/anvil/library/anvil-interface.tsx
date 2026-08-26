'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { TypographyP } from '@/ui/typography/typography';
import { Button } from '@/ui/shadcn/button';
import IngotCardSkeleton from './ingot-card-skeleton';
import { Ingot } from '@/lib/types/ingot-types';
import { useIngots, useDeleteIngot } from '@/hooks/use-ingots';
import AnvilInterfaceFilters from './anvil-filters';
import LibraryHeader from '@/widgets/library-header';
import LibraryCard from '@/widgets/library-card';

export default function AnvilInterface() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState<string>('ALL');

    const { data: ingots = [], isLoading, refetch } = useIngots();
    const deleteIngot = useDeleteIngot();

    function handleDelete(id: string) {
        deleteIngot.mutate(id, {
            onSuccess: () => toast.success('Ingot deleted'),
            onError: () =>
                toast.error('Failed to delete ingot, please try again'),
        });
    }

    function handleOpen(id: string) {
        router.push(`/anvil/edit/${id}`);
    }

    function resetFilters() {
        setSearchQuery('');
        setTypeFilter('ALL');
    }

    const filteredIngots = ingots.filter((ingot) => {
        const matchesSearch = ingot.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === 'ALL' || ingot.type === typeFilter;
        return matchesSearch && matchesType;
    });

    return (
        <div className="w-full mx-auto p-6 space-y-6">
            <LibraryHeader
                isLoading={isLoading}
                onRefresh={() => refetch()}
                mainButtonText="Create New Ingot"
                mainButtonLink="/anvil/create"
                headerTitleText="Ingot Library"
                headerDescriptionText="Manage and organize your knowledge Ingots"
            />
            <AnvilInterfaceFilters
                searchQuery={searchQuery}
                typeFilter={typeFilter}
                onSearchChange={setSearchQuery}
                onTypeChange={setTypeFilter}
                onReset={resetFilters}
            />

            {/* Loading */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <IngotCardSkeleton key={i} />
                    ))}
                </div>
            ) : filteredIngots.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-700 rounded-lg bg-slate-800/50">
                    <TypographyP className="text-slate-400 mb-4">
                        {ingots.length === 0
                            ? "You haven't created any ingots yet."
                            : 'No ingots match your filters.'}
                    </TypographyP>
                    {ingots.length === 0 && (
                        <Link href="/anvil/create">
                            <Button
                                variant="outline"
                                className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
                            >
                                Create your first Ingot
                            </Button>
                        </Link>
                    )}
                    {ingots.length > 0 && (
                        <Button
                            variant="outline"
                            onClick={resetFilters}
                            className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
                        >
                            Clear Filters
                        </Button>
                    )}
                </div>
            ) : (
                // Ingot Grid
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredIngots.map((ingot: Ingot) => (
                        <LibraryCard
                            key={ingot.id}
                            cardData={ingot}
                            onOpen={handleOpen}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
