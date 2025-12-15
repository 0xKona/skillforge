'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/ui/shadcn/button';
import IngotCardSkeleton from './ingot-card-skeleton';
import { Ingot } from '@/lib/types/ingot-types';
import { useAnvilInterfaceState } from '@/lib/store/use-anvil-interface';
import AnvilInterfaceFilters from './anvil-filters';
import LibraryHeader from '@/widgets/library-header';
import LibraryCard from '@/widgets/library-card';

export default function AnvilInterface() {
    const {
        loading,
        anvilIngots,
        loadAnvilIngots,
        searchQuery,
        typeFilter,
        resetFilters,
    } = useAnvilInterfaceState();

    useEffect(() => {
        loadAnvilIngots();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filteredIngots = anvilIngots.filter((ingot) => {
        const matchesSearch = ingot.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === 'ALL' || ingot.type === typeFilter;
        return matchesSearch && matchesType;
    });

    return (
        <div className="w-full mx-auto p-6 space-y-6">
            {/* <AnvilHeader /> */}
            <LibraryHeader
                isLoading={loading}
                onRefresh={loadAnvilIngots}
                mainButtonText="Create New Ingot"
                mainButtonLink="/anvil/create"
                headerTitleText="Ingot Library"
                headerDescriptionText="Manage and organize your knowledge Ingots"
            />
            <AnvilInterfaceFilters />

            {/* Loading */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <IngotCardSkeleton key={i} />
                    ))}
                </div>
            ) : filteredIngots.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-700 rounded-lg bg-slate-800/50">
                    <p className="text-slate-400 mb-4">
                        {anvilIngots.length === 0
                            ? "You haven't created any ingots yet."
                            : 'No ingots match your filters.'}
                    </p>
                    {anvilIngots.length === 0 && (
                        <Link href="/anvil/create">
                            <Button
                                variant="outline"
                                className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
                            >
                                Create your first Ingot
                            </Button>
                        </Link>
                    )}
                    {anvilIngots.length > 0 && (
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
                        <LibraryCard key={ingot.id} cardData={ingot} />
                    ))}
                </div>
            )}
        </div>
    );
}
