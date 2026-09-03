export interface NavigationLinkObject {
    displayText: string;
    route: string;
    iconPath: string;
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

export const navigationBarLinks: NavigationLinkObject[] = [
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
