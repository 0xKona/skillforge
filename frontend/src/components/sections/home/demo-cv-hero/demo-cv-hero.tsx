'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { IngotLibraryView } from './ingot-library-view';
import { CvPreviewView } from './cv-preview-view';

type DemoView = 'anvil' | 'cv';

const AUTO_RETURN_MS = 10_000;

export function DemoCvHero() {
    const [view, setView] = useState<DemoView>('anvil');
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Clear any pending auto-return timeout
    const clearAutoReturn = useCallback(() => {
        if (timeoutRef.current !== null) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    const goToAnvil = useCallback(() => {
        clearAutoReturn();
        setView('anvil');
    }, [clearAutoReturn]);

    const goToCv = useCallback(() => {
        clearAutoReturn();
        setView('cv');
        // Auto-return to anvil after 10s
        timeoutRef.current = setTimeout(goToAnvil, AUTO_RETURN_MS);
    }, [clearAutoReturn, goToAnvil]);

    // Cleanup on unmount
    useEffect(
        () => () => {
            clearAutoReturn();
        },
        [clearAutoReturn]
    );

    return (
        <div className="relative mx-auto w-full max-w-[560px]">
            {/* Ambient glow */}
            <div
                aria-hidden="true"
                className="absolute -inset-5 rounded-2xl bg-flux/10 blur-3xl"
            />

            {/* Panel frame — fixed height, both views fill it exactly */}
            <motion.div
                layout
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="relative h-[420px] overflow-hidden rounded-xl border border-white/10 bg-graphite shadow-2xl shadow-black/30"
            >
                <AnimatePresence mode="wait">
                    {view === 'anvil' ? (
                        <IngotLibraryView key="anvil" onPreview={goToCv} />
                    ) : (
                        <CvPreviewView key="cv" onBack={goToAnvil} />
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
