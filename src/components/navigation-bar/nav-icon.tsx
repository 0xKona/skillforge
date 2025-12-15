'use client';

import AboutIcon from '../icons/about';
import AnvilIcon from '../icons/anvil';
import ForgeIcon from '../icons/forge';
import HomeIcon from '../icons/home';

export default function NavIcon({
    route,
    isActive,
}: {
    route: string;
    isActive: boolean;
}) {
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
}
