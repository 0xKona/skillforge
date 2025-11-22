'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/icons/logo';
import { Button } from '@/components/ui/shadcn/button';
import HomeIcon from '../icons/home';
import ForgeIcon from '../icons/forge';
import AnvilIcon from '../icons/anvil';
import AboutIcon from '../icons/about';
import { RefObject, useRef, useState } from 'react';
import { useClickOutside } from '@/hooks/use-click-outside';
import { useAuth } from '@/hooks/use-auth';
import UserDropdown from './user-dropdown';

export interface NavigationLinkObject {
    displayText: string;
    route: string;
    iconPath?: string;
}

export const navigationLinks: NavigationLinkObject[] = [
    {
        displayText: 'Home',
        route: '/',
        iconPath: '/icons/home.svg',
    },
    {
        displayText: 'Forge',
        route: '/forge',
        iconPath: '/icons/forge.svg',
    },
    {
        displayText: 'Anvil',
        route: '/anvil',
        iconPath: '/icons/anvil.svg',
    },
    {
        displayText: 'About',
        route: '/about',
        iconPath: '/icons/about.svg',
    },
];

const NavIcon = ({ route, isActive }: { route: string; isActive: boolean }) => {
    const iconProps = {
        size: 20,
        color: isActive ? '#f97316' : 'currentColor',
        className: 'group-hover:!text-orange-500 transition-colors',
    };

    switch (route) {
        case '/':
            return <HomeIcon {...iconProps} />;
        case '/forge':
            return <ForgeIcon {...iconProps} />;
        case '/anvil':
            return <AnvilIcon {...iconProps} />;
        case '/about':
            return <AboutIcon {...iconProps} />;
        default:
            return null;
    }
};

function BurgerNav() {
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
                        {navigationLinks.map(
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

function NavItem({ navItem }: { navItem: NavigationLinkObject }) {
    const pathname = usePathname();
    const isActive = pathname === navItem.route;
    return (
        <li key={navItem.displayText + navItem.route}>
            <Link
                href={navItem.route}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 group normal-case ${
                    isActive
                        ? 'bg-forge-orange/10 border border-forge-orange text-forge-orange shadow-sm'
                        : 'hover:bg-slate-700/50 hover:text-forge-orange border border-transparent'
                }`}
            >
                <div className="transition-colors">
                    <NavIcon route={navItem.route} isActive={isActive} />
                </div>
                <span className="normal-case">{navItem.displayText}</span>
            </Link>
        </li>
    );
}

export default function NavBar() {
    const { isAuthenticated } = useAuth();

    return (
        <nav className="relative grid grid-cols-3 items-center p-4 w-full bg-slate-950 text-white">
            {/* Column 1 */}
            <Link
                href={'/'}
                className="hidden lg:flex items-center space-x-2 justify-self-start"
            >
                <Logo size={40} color="white" />
                <span className="text-white text-3xl font-extrabold italic">
                    SkillForge
                </span>
            </Link>
            <BurgerNav />
            {/* Column 2 */}
            {/* Show logo on mobile / tablet and nav on desktop */}
            <ul className="hidden lg:flex space-x-6 justify-center col-start-2">
                {navigationLinks.map((navItem: NavigationLinkObject) => (
                    <NavItem key={JSON.stringify(navItem)} navItem={navItem} />
                ))}
            </ul>
            <Link
                href={'/'}
                className="flex items-center space-x-2 justify-self-center lg:hidden col-start-2"
            >
                <Logo size={40} color="white" />
            </Link>
            {/* Column 3 */}
            <div className="justify-self-end col-start-3">
                {/* Conditional based on login status */}
                {isAuthenticated ? (
                    <div className="">
                        <UserDropdown />
                    </div>
                ) : (
                    <Button variant="default" size="lg">
                        <Link href={'/login'}>Login</Link>
                    </Button>
                )}
            </div>
        </nav>
    );
}
