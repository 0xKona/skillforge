'use client';

import Link from 'next/link';
import Logo from '@/components/common/icons/logo';
import { Button } from '@/ui/shadcn/button';
import UserDropdown from './nav-profile-menu';
import { useClientAuth } from '@/lib/store/use-client-auth';
import { Skeleton } from '@/ui/shadcn/skeleton';
import { NavigationLinkObject } from '@/lib/types/nav-types';
import BurgerNav from './nav-menu-mobile';
import NavItem from './nav-item';
import { navigationBarLinks } from '@/lib/constants/routing';
import { TypographyH1 } from '@/components/common/ui/typography/typography';

export default function NavBar() {
    const { isAuthenticated, loading } = useClientAuth();

    return (
        <nav className="w-full bg-slate-950 text-white">
            <div className="relative grid grid-cols-3 items-center p-4 w-full max-w-screen-2xl mx-auto">
                {/* Column 1 */}
                <Link
                    href={'/'}
                    className="hidden lg:flex items-center space-x-2 justify-self-start"
                >
                    <Logo size={40} color="white" />
                    <TypographyH1 className="text-white text-3xl font-bold italic">
                        SkillForge
                    </TypographyH1>
                </Link>
                <BurgerNav />
                {/* Column 2 */}
                {/* Show logo on mobile / tablet and nav on desktop */}
                <ul className="hidden lg:flex space-x-6 justify-center col-start-2">
                    {navigationBarLinks.map((navItem: NavigationLinkObject) => (
                        <NavItem key={navItem.route} navItem={navItem} />
                    ))}
                </ul>
                <Link
                    href={'/'}
                    className="flex items-center space-x-2 justify-self-center lg:hidden col-start-2"
                >
                    <Logo size={40} color="white" />
                    <TypographyH1 className="hidden sm:flex text-white text-3xl font-bold italic">
                        SkillForge
                    </TypographyH1>
                </Link>
                {/* Column 3 */}
                <div className="justify-self-end col-start-3">
                    {/* Conditional based on login status */}
                    {loading ? (
                        <Skeleton className="h-10 w-10 rounded-full bg-slate-800" />
                    ) : isAuthenticated ? (
                        <UserDropdown />
                    ) : (
                        <Button variant="default" size="lg">
                            <Link href={'/login'}>Login</Link>
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    );
}
