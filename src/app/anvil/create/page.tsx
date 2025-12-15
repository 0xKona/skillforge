'use client';

import { useSearchParams } from 'next/navigation';
import IngotEditor from '@/components/features/anvil/editor/ingot-editor';
import IngotTypeSelection from '@/components/features/anvil/ingot-type-selection';
import { Suspense } from 'react';
import { NewIngot } from '@/lib/types/ingot-types';
import MappingHelpers from '@/lib/classes/helpers/mapping-helpers';

function CreateIngotContent() {
    const searchParams = useSearchParams();
    const initialType = searchParams.get('ingotType');

    if (MappingHelpers.checkIsValidIngotType(initialType)) {
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
