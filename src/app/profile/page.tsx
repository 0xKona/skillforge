'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function UserManagementPage() {
    const router = useRouter();

    useEffect(() => {
        router.push('/profile/edit-profile');
    }, [router]);

    return null;
}
