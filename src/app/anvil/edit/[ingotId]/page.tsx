'use client';

import { useRouter } from 'next/navigation';
import IngotEditor from '@/components/anvil/ingot-editor';
import { use } from 'react';

export default function EditIngotPage({
    params,
}: {
    params: Promise<{ ingotId: string }>;
}) {
    const router = useRouter();

    const resolvedParams = use(params);
    const { ingotId } = resolvedParams;

    return (
        <IngotEditor ingotId={ingotId} onBack={() => router.push('/anvil')} />
    );
}
