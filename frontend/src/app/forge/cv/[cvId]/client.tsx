'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useCv } from '@/hooks/use-cvs';
import { useCvDocumentStore } from '@/lib/store/use-cv-document';
import { CvEditor } from '@/components/features/forge/cv-editor';

export default function CvEditorClient() {
    const params = useParams();
    const cvId = params.cvId as string;
    const { data: cv, isLoading } = useCv(cvId);
    const setDocument = useCvDocumentStore((s) => s.setDocument);
    const reset = useCvDocumentStore((s) => s.reset);

    useEffect(() => {
        if (cv) {
            setDocument(cv);
        }
        return () => reset();
    }, [cv, setDocument, reset]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-56px)] bg-graphite">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-flux border-t-transparent" />
                    <p className="text-sm text-ash">Loading document...</p>
                </div>
            </div>
        );
    }

    if (!cv) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-56px)] bg-graphite">
                <p className="text-sm text-ash">Document not found.</p>
            </div>
        );
    }

    return <CvEditor />;
}
