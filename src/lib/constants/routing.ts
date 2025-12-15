import { NavigationLinkObject } from '../types/nav-types';

export const PROTECTED_ROUTES = ['/forge', '/anvil', '/profile', '/api'];
export const AUTH_ROUTES = ['/login'];

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
