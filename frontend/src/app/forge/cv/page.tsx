import { Suspense } from 'react';
import CvEditorClient from './client';

function LoadingEditor() {
    return (
        <div className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-graphite">
            <div className="flex flex-col items-center gap-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-flux border-t-transparent" />
                <p className="text-sm text-ash">Loading document...</p>
            </div>
        </div>
    );
}

export default function CvEditorPage() {
    return (
        <Suspense fallback={<LoadingEditor />}>
            <CvEditorClient />
        </Suspense>
    );
}
