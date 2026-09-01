'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronDown, GripVertical, Trash2 } from 'lucide-react';

import { Button } from '@/ui/shadcn/button';
import { useCvDocumentStore } from '@/lib/store/use-cv-document';
import { SECTION_SCHEMAS } from '@/lib/constants/cv-constants';
import { springs } from '@/lib/constants/cv-editor-animations';
import type { DocumentItem, SectionType } from '@/lib/types/cv-document-types';
import { cn } from '@/lib/utils';

import { ItemFields } from './item-fields';
import { SubItemList } from './sub-item-list';

interface ItemBlockProps {
    item: DocumentItem;
    sectionIndex: number;
    itemIndex: number;
    sectionType: SectionType;
}

/**
 * Returns a compact headline for a collapsed item based on its fields.
 */
function getItemHeadline(item: DocumentItem, sectionType: SectionType): string {
    const schema = SECTION_SCHEMAS[sectionType];
    const fieldKeys = Object.keys(schema.fields);
    // Take the first required field or first field as primary
    const primaryKey =
        fieldKeys.find((k) => schema.fields[k].required) ?? fieldKeys[0];
    const primary = item.fields[primaryKey] || '';

    // Find dates for a secondary display
    const dateKeys = fieldKeys.filter((k) => schema.fields[k].type === 'date');
    const dates = dateKeys.map((k) => item.fields[k]).filter(Boolean);
    const dateStr = dates.length > 0 ? dates.join(' – ') : '';

    if (!primary && !dateStr) return 'Empty entry';
    if (!dateStr) return primary;
    return `${primary} · ${dateStr}`;
}

export function ItemBlock({
    item,
    sectionIndex,
    itemIndex,
    sectionType,
}: ItemBlockProps) {
    const [expanded, setExpanded] = useState(false);
    const removeItem = useCvDocumentStore((s) => s.removeItem);
    const schema = SECTION_SCHEMAS[sectionType];

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                'rounded-md border bg-gunmetal transition-colors duration-150',
                isDragging
                    ? 'border-border-hot opacity-90 shadow-md'
                    : expanded
                      ? 'border-border-hot bg-flux/10'
                      : 'border-border-default hover:border-border-warm'
            )}
        >
            {/* Collapsed header row */}
            <div className="flex items-center gap-2 px-2.5 py-2">
                <button
                    {...attributes}
                    {...listeners}
                    className="cursor-grab touch-none text-ash opacity-40 transition-opacity hover:opacity-100 active:cursor-grabbing"
                    aria-label="Drag to reorder"
                >
                    <GripVertical className="h-3.5 w-3.5" />
                </button>

                <button
                    className="flex flex-1 items-center gap-2 text-left"
                    onClick={() => setExpanded(!expanded)}
                    aria-expanded={expanded}
                >
                    <span className="text-sm text-text-primary truncate">
                        {getItemHeadline(item, sectionType)}
                    </span>
                    <ChevronDown
                        className={cn(
                            'h-3.5 w-3.5 text-ash transition-transform duration-150',
                            expanded && 'rotate-180'
                        )}
                    />
                </button>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:text-destructive"
                    onClick={() => removeItem(sectionIndex, itemIndex)}
                    aria-label="Remove item"
                >
                    <Trash2 className="h-3 w-3" />
                </Button>
            </div>

            {/* Expanded content */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={springs.snappy}
                        className="overflow-hidden"
                    >
                        <div className="border-t border-border-default px-2.5 pb-3 pt-2.5">
                            <ItemFields
                                item={item}
                                sectionIndex={sectionIndex}
                                itemIndex={itemIndex}
                                sectionType={sectionType}
                            />

                            {schema.allowSubItems && (
                                <SubItemList
                                    item={item}
                                    sectionIndex={sectionIndex}
                                    itemIndex={itemIndex}
                                    sectionType={sectionType}
                                />
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
