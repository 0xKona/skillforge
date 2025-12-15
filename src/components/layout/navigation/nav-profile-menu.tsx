'use client';

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '../../ui/component-library/shadcn-components/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../../ui/component-library/shadcn-components/dropdown-menu';
import Link from 'next/link';
import { useClientAuth } from '@/lib/store/use-client-auth';
import React from 'react';
import { Skeleton } from '../../ui/component-library/shadcn-components/skeleton';

export default function UserDropdown() {
    const { signOut, avatarUrl } = useClientAuth();

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
                    <DropdownMenuItem onClick={signOut}>
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
