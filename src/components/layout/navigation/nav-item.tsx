'use client';

import { NavigationLinkObject } from '@/lib/types/nav-types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NavIcon from './nav-icon';

export default function NavItem({
    navItem,
}: {
    navItem: NavigationLinkObject;
}) {
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
