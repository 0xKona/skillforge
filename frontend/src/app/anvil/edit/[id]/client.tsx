'use client';

import { useParams } from 'next/navigation';
import { useIngot } from '@/hooks/use-ingots';
import IngotEditor from '@/components/features/anvil/editor/ingot-editor';
import IngotEditorSkeleton from '@/components/features/anvil/editor/ingot-editor-skeleton';

export default function IngotEditorClient() {
    const params = useParams<{ id: string }>();
    const ingotId = params.id;
    const { data: ingot, isLoading, isError } = useIngot(ingotId);

    if (isLoading) {
        return (
            <main className="min-h-[calc(100vh-56px)] bg-graphite">
                <IngotEditorSkeleton />
            </main>
        );
    }

    if (isError || !ingot) {
        return (
            <main className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-graphite px-4">
                <p className="text-sm text-ash">Ingot not found.</p>
            </main>
        );
    }

    return (
        <main className="min-h-[calc(100vh-56px)] bg-graphite">
            <IngotEditor key={ingot.id} initialIngotData={ingot} />
        </main>
    );
}
