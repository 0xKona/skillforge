'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Skeleton } from '@/ui/shadcn/skeleton';
import { useCv, useCreateCv } from '@/hooks/use-cvs';
import { useCvDocumentStore } from '@/lib/store/use-cv-document';
import { CvEditor } from '@/components/features/forge/cv-editor';
import { useCvAutoSave } from '@/hooks/use-cv-auto-save-v2';

export default function CvEditorWrapper({ cvId }: { cvId: string }) {
    const router = useRouter();
    const isNew = cvId === 'new';

    // Fetch existing CV
    const { data: fetchedCv, isLoading } = useCv(isNew ? '' : cvId);

    // Create mutation for new CVs
    const createCv = useCreateCv();

    // Store actions
    const setDocument = useCvDocumentStore((s) => s.setDocument);
    const reset = useCvDocumentStore((s) => s.reset);

    // Auto-save (3s debounce)
    useCvAutoSave(3000);

    // Handle "new" case — create CV then redirect
    useEffect(() => {
        if (!isNew) return;

        createCv.mutate(
            { version: 1, title: 'Untitled CV', content: { sections: [] } },
            {
                onSuccess: (created) => {
                    router.replace(`/forge/cv/${created.id}`);
                },
                onError: () => {
                    toast.error('Failed to create CV');
                    router.push('/forge');
                },
            }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Load fetched CV into store
    useEffect(() => {
        if (fetchedCv) {
            setDocument(fetchedCv);
        }
    }, [fetchedCv, setDocument]);

    // Reset store on unmount
    useEffect(() => {
        return () => reset();
    }, [reset]);

    // Loading state
    if (isNew || isLoading) {
        return (
            <div className="min-h-screen bg-forge-surface p-6 space-y-4">
                <Skeleton className="h-12 w-1/3" />
                <Skeleton className="h-[600px] w-full" />
            </div>
        );
    }

    if (!fetchedCv) {
        return (
            <div className="min-h-screen bg-forge-surface flex items-center justify-center">
                <p className="text-forge-text-muted">CV not found</p>
            </div>
        );
    }

    return <CvEditor />;
}
