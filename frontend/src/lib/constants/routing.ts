export const PROTECTED_ROUTES = ['/forge', '/anvil', '/profile', '/api'];
export const AUTH_ROUTES = ['/login'];

export interface NavigationLinkObject {
    displayText: string;
    route: string;
    iconPath?: string;
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
