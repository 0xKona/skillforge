'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';

const links = [
    { href: '/anvil', label: 'Anvil' },
    { href: '/forge', label: 'Forge' },
];

export function NavLinks() {
    const pathname = usePathname();

    return (
        <nav className="hidden md:flex items-center gap-6">
            {links.map(({ href, label }) => {
                const isActive = pathname.startsWith(href);
                return (
                    <Link
                        key={href}
                        href={href}
                        className={`relative text-sm font-medium transition-colors duration-150 ${
                            isActive
                                ? 'text-flux'
                                : 'text-ash hover:text-text-primary'
                        }`}
                    >
                        {label}
                        {isActive && (
                            <motion.span
                                layoutId="nav-indicator"
                                className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-flux"
                                style={{
                                    boxShadow:
                                        '0 2px 8px rgba(232, 99, 10, 0.3)',
                                }}
                                transition={{
                                    duration: 0.2,
                                    ease: [0.23, 1, 0.32, 1],
                                }}
                            />
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}
