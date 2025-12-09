import { CvEditor } from '@/components/cv-interface/cv-editor/cv-editor';

interface PageProps {
    params: Promise<{ cvId: string }>;
}

export default async function CvEditorPage({ params }: PageProps) {
    const { cvId } = await params;

    return (
        <div className="max-h-fit">
            <CvEditor cvId={cvId === 'new' ? undefined : cvId} />;
        </div>
    );
}
