'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/ui/shadcn/button';
import CvCardSkeleton from './forge-components/cv-card-skeleton';
import { useCvs, useDeleteCv } from '@/hooks/use-cvs';
import LibraryHeader from '@/widgets/library-header';
import CvLibrarySearch from './forge-components/cv-library-search';
import LibraryCard from '@/widgets/library-card';
import { TypographyP } from '@/ui/typography/typography';

export default function CvLibraryInterface() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const { data: cvs = [], isLoading, refetch } = useCvs();
    const deleteCv = useDeleteCv();

    function handleDelete(id: string) {
        deleteCv.mutate(id, {
            onSuccess: () => toast.success('CV deleted'),
            onError: () => toast.error('Failed to delete CV, please try again'),
        });
    }

    function handleOpen(id: string) {
        router.push(`/forge/cv/${id}`);
    }

    const filteredCvs = cvs.filter((cv) =>
        cv.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-full mx-auto p-6 space-y-6">
            {/* Header */}
            <LibraryHeader
                isLoading={isLoading}
                onRefresh={() => refetch()}
                mainButtonText="Create New CV"
                mainButtonLink="/forge/cv/new"
                headerTitleText="CV Library"
                headerDescriptionText="Manage and organize your Curriculum Vitae"
            />

            {/* Search */}
            <CvLibrarySearch
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />

            {/* Content */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <CvCardSkeleton key={i} />
                    ))}
                </div>
            ) : filteredCvs.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-700 rounded-lg bg-slate-800/50">
                    <TypographyP className="text-slate-400 mb-4">
                        {cvs.length === 0
                            ? "You haven't created any CVs yet."
                            : 'No CVs match your search.'}
                    </TypographyP>
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
                        <LibraryCard
                            key={cv.id}
                            cardData={cv}
                            onOpen={handleOpen}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
