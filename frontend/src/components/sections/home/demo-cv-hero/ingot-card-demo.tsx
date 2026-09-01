'use client';

import { motion } from 'motion/react';
import type { DemoIngot } from './demo-data';

interface IngotCardDemoProps {
    ingot: DemoIngot;
}

export function IngotCardDemo({ ingot }: IngotCardDemoProps) {
    return (
        <motion.div
            layoutId={ingot.layoutId}
            layout
            className="rounded-lg border border-border-default bg-gunmetal p-4"
        >
            {/* Type label row */}
            <div className="mb-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-flux" />
                <span className="font-mono text-xs text-ash">
                    {ingot.typeLabel}
                </span>
            </div>

            {/* Name */}
            <h3 className="truncate text-sm font-semibold text-text-primary">
                {ingot.name}
            </h3>

            {/* Entry count */}
            <span className="mt-2 inline-block font-mono text-xs text-ash">
                {ingot.billetCount}{' '}
                {ingot.billetCount === 1 ? 'entry' : 'entries'}
            </span>
        </motion.div>
    );
}
