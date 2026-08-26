'use client';

import { useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { useCvDocumentStore } from '@/lib/store/use-cv-document';
import { springs, scaleIn } from '@/lib/constants/cv-editor-animations';
import type { DocumentSection } from '@/lib/types/cv-document-types';

import { ItemBlock } from './item-block';

interface ItemListProps {
    sectionIndex: number;
    section: DocumentSection;
}

export function ItemList({ sectionIndex, section }: ItemListProps) {
    const moveItem = useCvDocumentStore((s) => s.moveItem);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
    );

    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            const { active, over } = event;
            if (!over || active.id === over.id) return;

            const oldIndex = section.items.findIndex(
                (item) => item.id === active.id
            );
            const newIndex = section.items.findIndex(
                (item) => item.id === over.id
            );
            if (oldIndex !== -1 && newIndex !== -1) {
                moveItem(sectionIndex, oldIndex, newIndex);
            }
        },
        [section.items, sectionIndex, moveItem]
    );

    if (section.items.length === 0) {
        return (
            <p className="py-3 text-center text-xs text-forge-text-muted">
                No entries yet
            </p>
        );
    }

    const itemIds = section.items.map((item) => item.id);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={itemIds}
                strategy={verticalListSortingStrategy}
            >
                <div className="flex flex-col gap-1.5">
                    <AnimatePresence mode="popLayout">
                        {section.items.map((item, itemIndex) => (
                            <motion.div
                                key={item.id}
                                layout
                                variants={scaleIn}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={springs.snappy}
                            >
                                <ItemBlock
                                    item={item}
                                    sectionIndex={sectionIndex}
                                    itemIndex={itemIndex}
                                    sectionType={section.type}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </SortableContext>
        </DndContext>
    );
}
