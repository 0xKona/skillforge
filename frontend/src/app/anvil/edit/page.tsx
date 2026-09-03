import { Suspense } from 'react';
import IngotEditorClient from './client';
import IngotEditorSkeleton from '@/components/features/anvil/editor/ingot-editor-skeleton';

export default function EditIngotPage() {
    return (
        <Suspense
            fallback={
                <main className="min-h-[calc(100vh-56px)] bg-graphite">
                    <IngotEditorSkeleton />
                </main>
            }
        >
            <IngotEditorClient />
        </Suspense>
    );
}
