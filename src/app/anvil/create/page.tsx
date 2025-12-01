'use client';

import { useRouter } from 'next/navigation';
import IngotEditor from '@/components/anvil/ingot-editor';

export default function CreateIngotPage() {
    const router = useRouter();

    return <IngotEditor ingotId={null} onBack={() => router.push('/anvil')} />;
}
