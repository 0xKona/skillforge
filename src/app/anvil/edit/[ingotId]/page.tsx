'use client';

import IngotEditor from '@/components/anvil/ingot-editor/ingot-editor';
import { use } from 'react';

export default function EditIngotPage({
    params,
}: {
    params: Promise<{ ingotId: string }>;
}) {

    const resolvedParams = use(params);
    const { ingotId } = resolvedParams;

    return (
        <IngotEditor ingotId={ingotId} />
    );
}
