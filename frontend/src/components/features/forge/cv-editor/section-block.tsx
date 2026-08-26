'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Eye, EyeOff, GripVertical, Trash2 } from 'lucide-react';

import { Button } from '@/ui/shadcn/button';
import { Input } from '@/ui/shadcn/input';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/ui/shadcn/alert-dialog';
import { useCvDocumentStore } from '@/lib/store/use-cv-document';
import { SECTION_META } from '@/lib/constants/cv-constants';
import type { DocumentSection } from '@/lib/types/cv-document-types';
import { cn } from '@/lib/utils';

import { ItemList } from './item-list';
import { SectionActions } from './section-actions';

interface SectionBlockProps {
    section: DocumentSection;
    index: number;
}

export function SectionBlock({ section, index }: SectionBlockProps) {
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const updateSectionTitle = useCvDocumentStore((s) => s.updateSectionTitle);
    const toggleSectionVisibility = useCvDocumentStore(
        (s) => s.toggleSectionVisibility
    );
    const removeSection = useCvDocumentStore((s) => s.removeSection);

    const meta = SECTION_META[section.type];
    const Icon = meta.icon;

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: section.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                'rounded-lg border bg-forge-card transition-colors duration-150',
                isDragging
                    ? 'border-forge-border-hot opacity-90 shadow-lg scale-[1.02]'
                    : 'border-forge-border hover:border-forge-border-warm'
            )}
        >
            {/* Section header */}
            <div className="flex items-center gap-2 px-3 py-2">
                {/* Drag handle */}
                <button
                    {...attributes}
                    {...listeners}
                    className="cursor-grab touch-none text-forge-text-muted opacity-50 transition-opacity hover:opacity-100 active:cursor-grabbing"
                    aria-label="Drag to reorder"
                >
                    <GripVertical className="h-4 w-4" />
                </button>

                {/* Icon */}
                <Icon className="h-4 w-4 text-forge-text-muted" />

                {/* Title */}
                {isEditingTitle ? (
                    <Input
                        autoFocus
                        value={section.title}
                        onChange={(e) =>
                            updateSectionTitle(index, e.target.value)
                        }
                        onBlur={() => setIsEditingTitle(false)}
                        onKeyDown={(e) =>
                            e.key === 'Enter' && setIsEditingTitle(false)
                        }
                        className="h-7 border-none bg-transparent px-1 text-sm font-medium shadow-none focus-visible:ring-1 focus-visible:ring-forge-border-hot"
                    />
                ) : (
                    <button
                        onClick={() => setIsEditingTitle(true)}
                        className="text-sm font-medium text-forge-text hover:text-forge-accent transition-colors"
                    >
                        {section.title}
                    </button>
                )}

                {/* Item count */}
                <span className="text-xs text-forge-text-muted">
                    {section.items.length}{' '}
                    {section.items.length === 1 ? 'item' : 'items'}
                </span>

                <div className="ml-auto flex items-center gap-1">
                    {/* Visibility */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => toggleSectionVisibility(index)}
                        aria-label={
                            section.visible ? 'Hide section' : 'Show section'
                        }
                    >
                        {section.visible ? (
                            <Eye className="h-3.5 w-3.5 text-forge-text-muted" />
                        ) : (
                            <EyeOff className="h-3.5 w-3.5 text-forge-text-muted" />
                        )}
                    </Button>

                    {/* Delete */}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 hover:text-destructive"
                                aria-label="Remove section"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Remove section
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will remove the {section.title} section
                                    and all its entries. You can undo this
                                    action.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => removeSection(index)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    Remove
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            {/* Content (hidden when section not visible) */}
            {section.visible && (
                <div className="border-t border-forge-border px-3 pb-3 pt-2">
                    <ItemList sectionIndex={index} section={section} />
                    <SectionActions
                        sectionIndex={index}
                        sectionType={section.type}
                    />
                </div>
            )}
        </div>
    );
}
