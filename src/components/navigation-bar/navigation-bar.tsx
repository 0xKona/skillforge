'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/icons/logo';
import { Button } from '@/components/ui/shadcn/button';
import HomeIcon from '../icons/home';
import ForgeIcon from '../icons/forge';
import AnvilIcon from '../icons/anvil';
import AboutIcon from '../icons/about';

// TODO - FINISH LATER, THIS IS A BASIC IMPLEMENTATION TO MAKE WORKING ON LANDING PAGE EASIER

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
    return (
        <nav className="flex items-center justify-between p-4 w-dvw fixed top-0 z-[100] bg-slate-950 text-white">
            <div className="flex items-center space-x-2">
                <Logo size={40} />
                <span className="text-white text-xl font-bold">SkillForge</span>
            </div>
            <ul className="flex space-x-6">
                {navigationLinks.map((navItem: NavigationLinkObject) => (
                    <NavItem key={JSON.stringify(navItem)} navItem={navItem} />
                ))}
            </ul>
            <div>
                {/* Conditional based on login status */}
                <Button variant="default" size="lg">
                    <Link href={'/login'}>Login</Link>
                </Button>
            </div>
        </nav>
    );
}
