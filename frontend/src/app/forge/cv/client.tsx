'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCv } from '@/hooks/use-cvs';
import { useCvDocumentStore } from '@/lib/store/use-cv-document';
import { CvEditor } from '@/components/features/forge/cv-editor';

export default function CvEditorClient() {
    const searchParams = useSearchParams();
    const cvId = searchParams.get('id') ?? '';
    const { data: cv, isLoading } = useCv(cvId);
    const setDocument = useCvDocumentStore((s) => s.setDocument);
    const reset = useCvDocumentStore((s) => s.reset);
    const lastLoadedIdRef = useRef<string | null>(null);

    useEffect(() => {
        if (cv && cv.id !== lastLoadedIdRef.current) {
            lastLoadedIdRef.current = cv.id;
            setDocument(cv);
        }
    }, [cv, setDocument]);

    useEffect(() => {
        return () => {
            reset();
            lastLoadedIdRef.current = null;
        };
    }, [reset]);

    if (!cvId) {
        return (
            <div className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-graphite">
                <p className="text-sm text-ash">Document not found.</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-graphite">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-flux border-t-transparent" />
                    <p className="text-sm text-ash">Loading document...</p>
                </div>
            </div>
        );
    }

    if (!cv) {
        return (
            <div className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-graphite">
                <p className="text-sm text-ash">Document not found.</p>
            </div>
        );
    }

    return <CvEditor />;
}
