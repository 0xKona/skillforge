'use client';

import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { useEffect } from 'react';

const links = [
    { href: '/forge', label: 'Forge' },
    { href: '/anvil', label: 'Anvil' },
    { href: '/profile', label: 'Profile' },
];

interface MobileOverlayProps {
    open: boolean;
    onClose: () => void;
}

export function MobileOverlay({ open, onClose }: MobileOverlayProps) {
    const pathname = usePathname();

    // Close on route change
    useEffect(() => {
        onClose();
    }, [pathname, onClose]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="fixed inset-0 z-50 bg-crucible flex flex-col"
                >
                    {/* Close button */}
                    <div className="flex justify-end p-4">
                        <button
                            onClick={onClose}
                            className="h-8 w-8 flex items-center justify-center text-ash hover:text-text-primary transition-colors"
                            aria-label="Close menu"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Links */}
                    <nav className="flex flex-col items-center justify-center flex-1 gap-8">
                        {links.map(({ href, label }, index) => {
                            const isActive = pathname.startsWith(href);
                            return (
                                <motion.div
                                    key={href}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: index * 0.03,
                                        duration: 0.15,
                                        ease: [0.23, 1, 0.32, 1],
                                    }}
                                >
                                    <Link
                                        href={href}
                                        onClick={onClose}
                                        className={`text-2xl font-medium transition-colors ${
                                            isActive
                                                ? 'text-flux'
                                                : 'text-ash hover:text-text-primary'
                                        }`}
                                    >
                                        {label}
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </nav>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
