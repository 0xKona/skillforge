import type { Transition, Variants } from 'motion/react';

// -- Spring presets --

export const springs = {
    /** Fast micro-interactions (150-200ms feel) */
    snappy: { type: 'spring', stiffness: 500, damping: 30 } as Transition,
    /** Structural layout shifts */
    smooth: { type: 'spring', stiffness: 350, damping: 30 } as Transition,
    /** Larger movements — sheets, panels */
    gentle: { type: 'spring', stiffness: 250, damping: 28 } as Transition,
} as const;

// -- Shared animation variants --

export const fadeIn: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

export const slideUp: Variants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -4 },
};

export const scaleIn: Variants = {
    initial: { opacity: 0, scale: 0.97 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.97 },
};

// -- Stagger container for lists --

export const staggerContainer: Variants = {
    animate: {
        transition: { staggerChildren: 0.04 },
    },
};

export const staggerItem: Variants = {
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -4 },
};
