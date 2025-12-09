import { Suspense } from 'react';

export default function CreateCvPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            {/* Create CV Component Here */}
        </Suspense>
    );
}
