'use client';

import { useSearchParams } from 'next/navigation';
import IngotEditor from '@/components/anvil/ingot-editor/ingot-editor';
import IngotTypeSelection from '@/components/anvil/ingot-type-selection';
import { Suspense } from 'react';

function CreateIngotContent() {
    const searchParams = useSearchParams();
    const initialType = searchParams.get('ingotType');

    if (initialType) {
        return <IngotEditor ingotId={null} initialType={initialType} />;
    }

    return <IngotTypeSelection />;
}

export default function CreateIngotPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CreateIngotContent />
        </Suspense>
    );
}
