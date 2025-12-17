'use client';

import { useEffect, useState } from 'react';
import { CvEditor } from '@/components/features/forge/editor/cv-editor';
import { generateClient } from 'aws-amplify/data';
import { CV_TEMPLATE } from '@/lib/templates/cv-template';
import { Skeleton } from '@/ui/shadcn/skeleton';
import { toast } from 'sonner';
import { Schema } from '@amplify/data/resource';

const client = generateClient<Schema>();

export default function CvEditorWrapper({ cvId }: { cvId: string }) {
    const [finalCvId, setFinalCvId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeCv = async () => {
            try {
                if (cvId === 'new') {
                    // Create new draft CV in DynamoDB on the client side
                    const { data: newCv, errors } =
                        await client.models.CV.create({
                            ...CV_TEMPLATE,
                            title: `Draft ${crypto.randomUUID()}`,
                            cvContent: JSON.stringify(CV_TEMPLATE.cvContent),
                        });

                    if (errors) {
                        throw new Error(errors[0].message);
                    }

                    if (newCv) {
                        setFinalCvId(newCv.id);
                    }
                } else {
                    setFinalCvId(cvId);
                }
            } catch (error) {
                console.error('Failed to initialize CV', error);
                toast.error('Failed to initialize CV');
            } finally {
                setLoading(false);
            }
        };

        initializeCv();
    }, [cvId]);

    if (loading) {
        return (
            <div className="w-full h-full p-6 space-y-4">
                <Skeleton className="h-12 w-1/3" />
                <Skeleton className="h-[600px] w-full" />
            </div>
        );
    }

    if (!finalCvId) {
        return <div className="p-6">Failed to load CV</div>;
    }

    return <CvEditor cvId={finalCvId} />;
}
