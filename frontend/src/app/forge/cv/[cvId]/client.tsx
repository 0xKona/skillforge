'use client';

import CvEditorWrapper from '@/components/layout/wrappers/cv-editor-wrapper';

interface CvEditorClientProps {
    cvId: string;
}

export default function CvEditorClient({ cvId }: CvEditorClientProps) {
    return <CvEditorWrapper cvId={cvId} />;
}
