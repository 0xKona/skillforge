'use client';

import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { MOBILE_NAV_LINKS } from '@/lib/constants/routing';

interface MobileOverlayProps {
    open: boolean;
    onClose: () => void;
}

export function MobileOverlay({ open, onClose }: MobileOverlayProps) {
    const pathname = usePathname();
    const previousPathname = useRef(pathname);

    // Close on route change
    useEffect(() => {
        if (previousPathname.current !== pathname) {
            previousPathname.current = pathname;
            onClose();
        }
    }, [pathname, onClose]);

    // Close on Escape and keep the page behind the menu from scrolling.
    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [open, onClose]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    id="mobile-navigation"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Mobile navigation"
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
                        {MOBILE_NAV_LINKS.map(({ href, label }, index) => {
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
