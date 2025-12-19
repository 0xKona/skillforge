'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/ui/shadcn/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/ui/shadcn/dropdown-menu';
import Link from 'next/link';
import { useClientAuth } from '@/lib/store/use-client-auth';
import React from 'react';
import { Skeleton } from '@/ui/shadcn/skeleton';
import { useRouter } from 'next/navigation';

export default function UserDropdown() {
    const { signOut, avatarUrl } = useClientAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        router.refresh();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="h-10 w-10 cursor-pointer">
                    <AvatarImage src={avatarUrl} className="object-cover" />
                    <AvatarFallback>
                        <Skeleton className="h-full w-full rounded-full bg-slate-800" />
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuGroup>
                    <Link href={'/profile'}>
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
