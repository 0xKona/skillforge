'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SESSION_KEY = 'skillforge-edu-banner-dismissed';

export function EducationBanner() {
    const [visible, setVisible] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.sessionStorage.getItem(SESSION_KEY) !== '1';
    });

    function dismiss() {
        window.sessionStorage.setItem(SESSION_KEY, '1');
        setVisible(false);
    }

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '100%', opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                    className="fixed bottom-0 left-0 right-0 z-50 border-t border-border-default bg-crucible/95 backdrop-blur-sm"
                    role="banner"
                    aria-label="Educational project notice"
                >
                    <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 md:px-6">
                        {/* Flux dot */}
                        <span className="hidden h-2 w-2 shrink-0 rounded-full bg-flux sm:block" />

                        {/* Message */}
                        <p className="flex-1 text-xs leading-relaxed text-ash">
                            <span className="font-semibold text-text-primary">
                                Educational project.
                            </span>{' '}
                            SkillForge is built for learning purposes and is not
                            intended for commercial use. Do not enter sensitive
                            or confidential data.{' '}
                            <Link
                                href="/privacy"
                                className="text-flux underline-offset-2 hover:underline"
                            >
                                Privacy Policy
                            </Link>
                        </p>

                        {/* Dismiss */}
                        <button
                            onClick={dismiss}
                            aria-label="Dismiss notice"
                            className="shrink-0 rounded-md p-1 text-ash transition-colors hover:bg-gunmetal hover:text-text-primary"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
