'use client';

import { useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { useCvDocumentStore } from '@/lib/store/use-cv-document';
import { springs, scaleIn } from '@/lib/constants/cv-editor-animations';

import { SectionBlock } from './section-block';

export function SectionList() {
    const sections = useCvDocumentStore(
        (s) => s.document?.content.sections ?? []
    );
    const moveSection = useCvDocumentStore((s) => s.moveSection);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            const { active, over } = event;
            if (!over || active.id === over.id) return;

            const oldIndex = sections.findIndex((s) => s.id === active.id);
            const newIndex = sections.findIndex((s) => s.id === over.id);
            if (oldIndex !== -1 && newIndex !== -1) {
                moveSection(oldIndex, newIndex);
            }
        },
        [sections, moveSection]
    );

    if (sections.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-forge-text font-medium">
                    Start building your CV
                </p>
                <p className="mt-1 text-sm text-forge-text-muted">
                    Add your first section to get started.
                </p>
            </div>
        );
    }

    const sectionIds = sections.map((s) => s.id);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={sectionIds}
                strategy={verticalListSortingStrategy}
            >
                <div className="flex flex-col gap-3">
                    <AnimatePresence mode="popLayout">
                        {sections.map((section, index) => (
                            <motion.div
                                key={section.id}
                                layout
                                variants={scaleIn}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={springs.smooth}
                            >
                                <SectionBlock section={section} index={index} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </SortableContext>
        </DndContext>
    );
}
