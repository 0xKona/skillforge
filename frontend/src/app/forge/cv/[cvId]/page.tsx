import CvEditorWrapper from '@/components/layout/wrappers/cv-editor-wrapper';

interface PageProps {
    params: Promise<{ cvId: string }>;
}

export default async function CvEditorPage({ params }: PageProps) {
    const { cvId } = await params;

    return <CvEditorWrapper cvId={cvId} />;
}
