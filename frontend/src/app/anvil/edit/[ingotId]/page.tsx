import EditIngotClient from './client';

// Generate a placeholder path for static export.
// Actual routing happens client-side — the Amplify Hosting SPA rewrite
// serves this page for any /anvil/edit/* path.
export function generateStaticParams() {
    return [{ ingotId: 'placeholder' }];
}

interface PageProps {
    params: Promise<{ ingotId: string }>;
}

export default async function EditIngotPage({ params }: PageProps) {
    const { ingotId } = await params;

    return <EditIngotClient ingotId={ingotId} />;
}
