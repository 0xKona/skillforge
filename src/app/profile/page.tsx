'use client';

import { useRouter } from 'next/navigation';

export default function UserManagementPage() {
    const router = useRouter();
    router.push('/profile/edit-profile');
}
