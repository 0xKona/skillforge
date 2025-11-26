'use client';

import { useAuth } from '@/hooks/use-auth';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '../shadcn-components/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../shadcn-components/dropdown-menu';
import Link from 'next/link';
import { useGlobalAvatar } from '@/lib/store/global-avatar';
import React from 'react';

export default function UserDropdown() {
    const { userAttributes, signOut } = useAuth();

    const { avatarUrl, setAvatarUrl } = useGlobalAvatar();

    React.useEffect(() => {
        const authPicture = userAttributes?.picture as string;
        // Only update the store if the picture exists AND is different from what we have
        // This prevents infinite re-render loops
        if (authPicture && authPicture !== avatarUrl) {
            setAvatarUrl(authPicture);
        }
    }, [userAttributes, avatarUrl, setAvatarUrl]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar>
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback>CN</AvatarFallback>
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
