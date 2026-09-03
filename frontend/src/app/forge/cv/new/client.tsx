'use client';

import { useEffect } from 'react';
import { useCvDocumentStore } from '@/lib/store/use-cv-document';
import { buildBlankNewCv } from '@/lib/helpers/cv';
import { CvEditor } from '@/components/features/forge/cv-editor';

export default function NewCvClient() {
    const setDocument = useCvDocumentStore((s) => s.setDocument);
    const reset = useCvDocumentStore((s) => s.reset);

    useEffect(() => {
        setDocument(buildBlankNewCv());
        return () => reset();
    }, [setDocument, reset]);

    return <CvEditor />;
}
