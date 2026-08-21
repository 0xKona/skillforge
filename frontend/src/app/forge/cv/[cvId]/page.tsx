import CvEditorClient from './client';

// Generate a placeholder path for static export.
// Actual routing happens client-side — the Amplify Hosting SPA rewrite
// serves this page for any /forge/cv/* path.
export function generateStaticParams() {
    return [{ cvId: 'placeholder' }];
}

interface PageProps {
    params: Promise<{ cvId: string }>;
}

export default async function CvEditorPage({ params }: PageProps) {
    const { cvId } = await params;

    return <CvEditorClient cvId={cvId} />;
}
