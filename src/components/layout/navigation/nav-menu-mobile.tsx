'use client';

import { useClickOutside } from '@/hooks/use-click-outside';
import { navigationBarLinks } from '@/lib/constants/routing';
import { NavigationLinkObject } from '@/lib/types/nav-types';
import { RefObject, useRef, useState } from 'react';
import NavItem from './nav-item';

export default function BurgerNav() {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useClickOutside<HTMLDivElement>(
        () => setIsOpen(false),
        [buttonRef as RefObject<HTMLElement>]
    );

    return (
        <div className="lg:hidden">
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden flex flex-col space-y-1 p-2"
                aria-label="Toggle navigation menu"
            >
                {/* Burger menu icon */}
                <span className="w-5 h-0.5 bg-white"></span>
                <span className="w-5 h-0.5 bg-white"></span>
                <span className="w-5 h-0.5 bg-white"></span>
            </button>
            {isOpen && (
                <div
                    ref={menuRef}
                    className="absolute top-full left-0 w-full bg-slate-950 border-t border-slate-700 lg:hidden z-50"
                >
                    <ul className="flex flex-col space-y-2 p-4">
                        {navigationBarLinks.map(
                            (navItem: NavigationLinkObject) => (
                                <NavItem
                                    key={JSON.stringify(navItem)}
                                    navItem={navItem}
                                />
                            )
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
