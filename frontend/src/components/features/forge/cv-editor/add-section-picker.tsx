'use client';

import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';

import { Button } from '@/ui/shadcn/button';
import { useCvDocumentStore } from '@/lib/store/use-cv-document';
import {
    ALL_SECTION_TYPES,
    SECTION_META,
    sectionAccent,
} from '@/lib/constants/cv-constants';
import {
    springs,
    staggerContainer,
    staggerItem,
} from '@/lib/constants/cv-editor-animations';
import { cn } from '@/lib/utils';

export function AddSectionPicker() {
    const [open, setOpen] = useState(false);
    const sections = useCvDocumentStore(
        (s) => s.document?.content.sections ?? []
    );
    const addSection = useCvDocumentStore((s) => s.addSection);

    const usedTypes = useMemo(
        () => new Set(sections.map((s) => s.type)),
        [sections]
    );

    function handleSelect(type: (typeof ALL_SECTION_TYPES)[number]) {
        addSection(type);
        setOpen(false);
    }

    return (
        <div className="mt-4">
            {!open ? (
                <Button
                    variant="outline"
                    className="w-full border-dashed border-border-default text-ash hover:text-text-primary hover:border-border-warm h-10"
                    onClick={() => setOpen(true)}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add section
                </Button>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={springs.smooth}
                    className="rounded-lg border border-border-default bg-gunmetal p-4"
                >
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-medium text-text-primary">
                            Choose section type
                        </p>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                    </div>

                    <motion.div
                        className="grid grid-cols-2 gap-2 sm:grid-cols-3"
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                    >
                        {ALL_SECTION_TYPES.map((type) => {
                            const meta = SECTION_META[type];
                            const Icon = meta.icon;
                            const isUsed =
                                usedTypes.has(type) && meta.maxSections === 1;
                            const accent = sectionAccent[type];

                            return (
                                <motion.button
                                    key={type}
                                    variants={staggerItem}
                                    transition={springs.snappy}
                                    onClick={() =>
                                        !isUsed && handleSelect(type)
                                    }
                                    disabled={isUsed}
                                    className={cn(
                                        'flex flex-col items-center gap-1.5 rounded-md border p-3 text-center transition-colors',
                                        isUsed
                                            ? 'cursor-not-allowed border-border-default opacity-40'
                                            : 'border-border-default hover:border-border-warm hover:bg-flux/10'
                                    )}
                                >
                                    <div
                                        className={cn(
                                            'h-1 w-6 rounded-full',
                                            accent
                                        )}
                                    />
                                    <Icon className="h-5 w-5 text-ash" />
                                    <span className="text-xs text-text-primary">
                                        {meta.defaultTitle}
                                    </span>
                                </motion.button>
                            );
                        })}
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}
