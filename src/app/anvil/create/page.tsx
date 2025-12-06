'use client';

import { useSearchParams } from 'next/navigation';
import IngotEditor from '@/components/anvil/ingot-editor/ingot-editor';
import IngotTypeSelection from '@/components/anvil/ingot-type-selection';
import { Suspense } from 'react';
import { NewIngot } from '@/lib/types/ingot';

function CreateIngotContent() {
    const searchParams = useSearchParams();
    const initialType = searchParams.get('ingotType');

    if (initialType) {
        const ingotData: NewIngot = {
            name: '',
            type: initialType,
            content: { fields: {}, billetFormat: null, billets: [] },
        };

        return <IngotEditor initialIngotData={ingotData} />;
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
