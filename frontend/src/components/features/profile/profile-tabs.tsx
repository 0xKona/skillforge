'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Lock, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
    { href: '/profile/edit-profile', label: 'Profile', icon: User },
    { href: '/profile/edit-password', label: 'Password', icon: Lock },
    { href: '/profile/delete-account', label: 'Delete account', icon: Trash2 },
];

export function ProfileTabs() {
    const pathname = usePathname();

    return (
        <nav className="flex md:flex-col gap-1">
            {tabs.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                    <Link
                        key={href}
                        href={href}
                        className={cn(
                            'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150',
                            isActive
                                ? 'text-flux border-l-[3px] border-flux bg-flux/5 md:rounded-l-none'
                                : 'text-ash hover:text-text-primary'
                        )}
                    >
                        <Icon className="h-4 w-4" />
                        <span className="hidden md:inline">{label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
