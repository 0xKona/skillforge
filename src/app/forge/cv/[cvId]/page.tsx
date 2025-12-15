import { CvEditor } from '@/components/features/forge/editor/cv-editor';
import { serverClient } from '@/lib/amplify/server-data-client';
import { CV_TEMPLATE } from '@/lib/templates/cv-template';
import { randomUUID } from 'node:crypto';

interface PageProps {
    params: Promise<{ cvId: string }>;
}

export default async function CvEditorPage({ params }: PageProps) {
    const { cvId } = await params;

    let finalCvId = cvId;

    if (cvId === 'new') {
        // Create new draft CV in DynamoDB
        const newCv = await serverClient.models.CV.create({
            ...CV_TEMPLATE,
            title: `Draft ${randomUUID()}`,
            cvContent: JSON.stringify(CV_TEMPLATE.cvContent),
        });

        finalCvId = newCv.data?.id as string;
    }

    return <CvEditor cvId={finalCvId} />;
}
