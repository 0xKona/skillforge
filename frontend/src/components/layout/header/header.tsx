'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { NavWordmark } from './nav-wordmark';
import { NavLinks } from './nav-links';
import { NavUserMenu } from './nav-user-menu';
import { MobileOverlay } from './mobile-overlay';
import { Menu } from 'lucide-react';

export function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { isAuthenticated } = useAuth();

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-crucible border-b border-border-default">
                <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 md:px-6">
                    {/* Left: mobile menu + wordmark */}
                    <div className="flex items-center gap-3">
                        {isAuthenticated && (
                            <button
                                onClick={() => setMobileOpen(true)}
                                className="md:hidden flex items-center justify-center h-8 w-8 text-ash hover:text-text-primary transition-colors"
                                aria-label="Open menu"
                            >
                                <Menu className="h-5 w-5" />
                            </button>
                        )}
                        <NavWordmark />
                    </div>

                    {/* Centre: nav links (desktop, auth only) */}
                    {isAuthenticated && <NavLinks />}

                    {/* Right: user menu */}
                    <NavUserMenu />
                </div>
            </header>

            {/* Spacer for fixed header */}
            <div className="h-14" />

            {/* Mobile overlay */}
            <MobileOverlay
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
            />
        </>
    );
}
