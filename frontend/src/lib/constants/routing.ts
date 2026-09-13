export interface NavLinkItem {
    href: string;
    label: string;
}

type Route = '/' | '/forge' | '/anvil' | '/profile' | '/api' | '/login';

export const PROTECTED_ROUTES: Route[] = [
    '/forge',
    '/anvil',
    '/profile',
    '/api',
];
export const AUTH_ROUTES: Route[] = ['/login'];

/** Static-export-safe editor URLs. Dynamic /anvil/edit/:id paths 404 on Amplify. */
export function anvilEditPath(id: string): string {
    return `/anvil/edit/?id=${encodeURIComponent(id)}`;
}

export function forgeCvPath(id: string): string {
    return `/forge/cv/?id=${encodeURIComponent(id)}`;
}

export const MAIN_NAV_LINKS: NavLinkItem[] = [
    { href: '/anvil', label: 'Anvil' },
    { href: '/forge', label: 'Forge' },
];

export const MOBILE_NAV_LINKS: NavLinkItem[] = [
    { href: '/forge', label: 'Forge' },
    { href: '/anvil', label: 'Anvil' },
    { href: '/profile', label: 'Profile' },
];
