'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/component-library/shadcn-components/button';
import CvCard from './components/cv-card';
import CvCardSkeleton from './components/cv-card-skeleton';
import { useCvInterfaceState } from '@/lib/store/use-cv-interface';
import LibraryHeader from '../ui/library-header';
import CvLibrarySearch from './components/cv-library-search';

export default function CvLibraryInterface() {
    const { loading, cvs, loadCvs, searchQuery } = useCvInterfaceState();

    useEffect(() => {
        loadCvs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filteredCvs = cvs.filter((cv) =>
        cv.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-full mx-auto p-6 space-y-6">
            {/* Header */}
            <LibraryHeader
                isLoading={loading}
                onRefresh={loadCvs}
                mainButtonText="Create New CV"
                mainButtonLink="/forge/cv/new"
                headerTitleText="CV Library"
                headerDescriptionText="Manage and organize your Curriculum Vitae"
            />

            {/* Filters */}
            <CvLibrarySearch />

            {/* Content */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <CvCardSkeleton key={i} />
                    ))}
                </div>
            ) : filteredCvs.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-700 rounded-lg bg-slate-800/50">
                    <p className="text-slate-400 mb-4">
                        {cvs.length === 0
                            ? "You haven't created any CVs yet."
                            : 'No CVs match your search.'}
                    </p>
                    {cvs.length === 0 && (
                        <Link href="/forge/cv/new">
                            <Button
                                variant="outline"
                                className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
                            >
                                Create your first CV
                            </Button>
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCvs.map((cv) => (
                        <CvCard key={cv.id} cvData={cv} />
                    ))}
                </div>
            )}
        </div>
    );
}
