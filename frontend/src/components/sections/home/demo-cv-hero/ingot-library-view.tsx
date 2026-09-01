'use client';

import { motion } from 'motion/react';
import { Eye } from 'lucide-react';
import { DEMO_INGOTS } from './demo-data';
import { IngotCardDemo } from './ingot-card-demo';
import {
    staggerContainer,
    staggerItem,
} from '@/lib/constants/cv-editor-animations';
import AnvilIcon from '@/components/common/icons/anvil';

interface IngotLibraryViewProps {
    onPreview: () => void;
}

export function IngotLibraryView({ onPreview }: IngotLibraryViewProps) {
    return (
        <motion.div
            key="anvil-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="flex h-full flex-col"
        >
            {/* Anvil header bar */}
            <div className="flex items-center gap-2 border-b border-border-default bg-crucible px-4 py-3">
                <AnvilIcon className="h-4 w-4 text-flux" />
                <span className="font-display text-xs font-semibold text-text-primary">
                    Anvil
                </span>
                <span className="font-mono text-[10px] text-ash">
                    · Your ingot library
                </span>

                {/* Preview button — right-aligned */}
                <button
                    onClick={onPreview}
                    className="ml-auto flex items-center gap-1.5 rounded-md border border-border-default bg-gunmetal px-2.5 py-1.5 text-[10px] text-ash transition-colors hover:border-border-warm hover:text-text-primary"
                >
                    <Eye className="h-3 w-3" />
                    Preview
                </button>
            </div>

            {/* Ingot card list */}
            <motion.div
                className="flex flex-col gap-2.5 p-4"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
            >
                {DEMO_INGOTS.map((ingot) => (
                    <motion.div key={ingot.id} variants={staggerItem}>
                        <IngotCardDemo ingot={ingot} />
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
}
