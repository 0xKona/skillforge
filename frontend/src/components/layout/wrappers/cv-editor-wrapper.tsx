'use client';

import { useEffect, useState } from 'react';
import { CvEditor } from '@/components/features/forge/editor/cv-editor';
import { CV_TEMPLATE } from '@/lib/templates/cv-template';
import { Skeleton } from '@/ui/shadcn/skeleton';
import { toast } from 'sonner';
import { CvService } from '@/lib/classes/services/service-cv';

export default function CvEditorWrapper({ cvId }: { cvId: string }) {
    const [finalCvId, setFinalCvId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeCv = async () => {
            try {
                if (cvId === 'new') {
                    // Create new draft CV via the REST API
                    const newCv = await CvService.createCv({
                        ...CV_TEMPLATE,
                        title: `Draft ${crypto.randomUUID()}`,
                    });

                    setFinalCvId(newCv.id);
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
