'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { signOut } from '@/lib/api/auth';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/ui/shadcn/dropdown-menu';
import { User, LogOut } from 'lucide-react';

export function NavUserMenu() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="h-8 w-8 rounded-full bg-gunmetal animate-skeleton bg-gradient-to-r from-gunmetal via-slag to-gunmetal bg-[length:200%_100%]" />
        );
    }

    if (!isAuthenticated) {
        return (
            <Link
                href="/login"
                className="text-sm font-medium text-ash hover:text-text-primary transition-colors duration-150"
            >
                Login
            </Link>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="h-8 w-8 rounded-full bg-slag flex items-center justify-center hover:bg-border-warm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flux focus-visible:ring-offset-2 focus-visible:ring-offset-crucible">
                    <User className="h-4 w-4 text-ash" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-48 bg-gunmetal border-border-emphasis"
            >
                <Link href="/profile">
                    <DropdownMenuItem className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator className="bg-border-default" />
                <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
