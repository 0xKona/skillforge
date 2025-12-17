'use client';

import { useEffect, useState } from 'react';
import IngotEditor from '@/components/features/anvil/editor/ingot-editor';
import { Ingot } from '@/lib/types/ingot-types';
import { IngotService } from '@/lib/classes/services/ingot-service';
import { toast } from 'sonner';
import IngotEditorSkeleton from '@/components/features/anvil/editor/ingot-editor-skeleton';

export default function IngotEditorWrapper({ ingotId }: { ingotId: string }) {
    const [ingotData, setIngotData] = useState<Ingot | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIngot = async () => {
            try {
                const ingot = await IngotService.getIngot(ingotId);
                if (ingot) {
                    setIngotData(ingot);
                } else {
                    toast.error('Ingot not found');
                }
            } catch (error) {
                console.error('Failed to fetch ingot', error);
                toast.error('Failed to load ingot');
            } finally {
                setLoading(false);
            }
        };

        fetchIngot();
    }, [ingotId]);

    if (loading) {
        return <IngotEditorSkeleton />;
    }

    if (!ingotData) {
        return <div className="p-6">Ingot not found</div>;
    }

    return <IngotEditor initialIngotData={ingotData} />;
}
