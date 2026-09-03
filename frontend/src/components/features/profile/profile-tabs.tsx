'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Lock, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const primaryTabs = [
    { href: '/profile/edit-profile', label: 'Profile', icon: User },
    { href: '/profile/edit-password', label: 'Password', icon: Lock },
];

const dangerTab = {
    href: '/profile/delete-account',
    label: 'Delete account',
    icon: Trash2,
};

function TabLink({
    href,
    label,
    icon: Icon,
    destructive = false,
}: {
    href: string;
    label: string;
    icon: typeof User;
    destructive?: boolean;
}) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={cn(
                'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150',
                destructive &&
                    !isActive &&
                    'text-destructive/80 hover:text-destructive',
                !destructive && !isActive && 'text-ash hover:text-text-primary',
                isActive &&
                    !destructive &&
                    'border-l-[3px] border-flux bg-flux/5 text-flux md:rounded-l-none',
                isActive &&
                    destructive &&
                    'border-l-[3px] border-destructive bg-destructive/10 text-destructive md:rounded-l-none'
            )}
        >
            <Icon className="h-4 w-4 shrink-0" />
            <span>{label}</span>
        </Link>
    );
}

export function ProfileTabs() {
    return (
        <nav
            aria-label="Settings"
            className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible"
        >
            {primaryTabs.map((tab) => (
                <TabLink key={tab.href} {...tab} />
            ))}
            <div
                className="mx-2 hidden h-px bg-border-default md:mx-0 md:my-2 md:block"
                aria-hidden="true"
            />
            <TabLink {...dangerTab} destructive />
        </nav>
    );
}
