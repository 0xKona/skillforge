'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    ChevronDown,
    ChevronRight,
    Eye,
    EyeOff,
    MoreHorizontal,
} from 'lucide-react';

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
} from '@/ui/shadcn/alert-dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/ui/shadcn/dropdown-menu';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/ui/shadcn/collapsible';
import { useCvDocumentStore } from '@/lib/store/use-cv-document';
import { SECTION_META, sectionAccent } from '@/lib/constants/cv-constants';
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
    const [removeOpen, setRemoveOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const updateSectionTitle = useCvDocumentStore((s) => s.updateSectionTitle);
    const toggleSectionVisibility = useCvDocumentStore(
        (s) => s.toggleSectionVisibility
    );
    const removeSection = useCvDocumentStore((s) => s.removeSection);

    const meta = SECTION_META[section.type];
    const Icon = meta.icon;
    const accent = sectionAccent[section.type];

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

    const itemCount = section.items.length;

    return (
        <Collapsible
            open={!isCollapsed}
            onOpenChange={(open) => setIsCollapsed(!open)}
        >
            <div
                ref={setNodeRef}
                style={style}
                className={cn(
                    'relative overflow-hidden rounded-lg border bg-gunmetal transition-colors duration-150',
                    isDragging
                        ? 'border-border-hot opacity-90 shadow-lg scale-[1.02]'
                        : 'border-border-default hover:border-border-warm'
                )}
            >
                {/* Accent strip */}
                <div
                    className={cn('absolute left-0 top-0 h-full w-1', accent)}
                />

                {/* Section header */}
                <div className="flex flex-col gap-2 px-4 py-3 pl-5">
                    <div className="flex items-center gap-2">
                        {/* Drag handle */}
                        <button
                            {...attributes}
                            {...listeners}
                            className="cursor-grab touch-none text-ash opacity-50 transition-opacity hover:opacity-100 active:cursor-grabbing"
                            aria-label="Drag to reorder"
                        >
                            <MoreHorizontal className="h-4 w-4 rotate-90" />
                        </button>

                        {/* Collapse toggle */}
                        <CollapsibleTrigger asChild>
                            <button
                                className="flex h-7 w-7 items-center justify-center rounded-md text-ash transition-colors hover:bg-slag hover:text-text-primary"
                                aria-label={
                                    isCollapsed
                                        ? `Expand ${section.title}`
                                        : `Collapse ${section.title}`
                                }
                            >
                                {isCollapsed ? (
                                    <ChevronRight className="h-4 w-4" />
                                ) : (
                                    <ChevronDown className="h-4 w-4" />
                                )}
                            </button>
                        </CollapsibleTrigger>

                        {/* Icon */}
                        <Icon className="h-4 w-4 text-ash" />

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
                                    e.key === 'Enter' &&
                                    setIsEditingTitle(false)
                                }
                                className="h-7 border-none bg-transparent px-1 text-sm font-semibold shadow-none focus-visible:ring-1 focus-visible:ring-border-hot"
                            />
                        ) : (
                            <button
                                onClick={() => setIsEditingTitle(true)}
                                className="text-sm font-semibold text-text-primary hover:text-flux transition-colors"
                            >
                                {section.title}
                            </button>
                        )}

                        {/* Item count chip */}
                        <span className="rounded-full bg-slag px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ash">
                            {itemCount} {itemCount === 1 ? 'item' : 'items'}
                        </span>

                        <div className="ml-auto flex items-center gap-1">
                            {/* Visibility toggle */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => toggleSectionVisibility(index)}
                                aria-label={
                                    section.visible
                                        ? 'Hide section'
                                        : 'Show section'
                                }
                            >
                                {section.visible ? (
                                    <Eye className="h-3.5 w-3.5 text-ash" />
                                ) : (
                                    <EyeOff className="h-3.5 w-3.5 text-ash" />
                                )}
                            </Button>

                            {/* Actions menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                        aria-label="Section actions"
                                    >
                                        <MoreHorizontal className="h-3.5 w-3.5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                        onSelect={() =>
                                            toggleSectionVisibility(index)
                                        }
                                    >
                                        {section.visible ? 'Hide' : 'Show'}{' '}
                                        section
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="text-red-400 focus:text-red-400"
                                        onSelect={() => setRemoveOpen(true)}
                                    >
                                        Remove section
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* Sub-row: type label + section meta */}
                    <div className="flex items-center gap-2 text-xs text-ash">
                        <span className="font-mono uppercase tracking-wider">
                            {meta.singularLabel}
                        </span>
                        <span className="text-border-default">·</span>
                        <span>Click title to rename · Drag to reorder</span>
                    </div>
                </div>

                {/* Content (hidden when section not visible) */}
                <CollapsibleContent>
                    {section.visible && (
                        <div className="border-t border-border-default px-4 pb-3 pt-3 pl-5">
                            <ItemList sectionIndex={index} section={section} />
                            <SectionActions
                                sectionIndex={index}
                                sectionType={section.type}
                            />
                        </div>
                    )}
                </CollapsibleContent>

                {/* Remove section dialog */}
                <AlertDialog open={removeOpen} onOpenChange={setRemoveOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Remove section</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will remove the {section.title} section and
                                all its entries. You can undo this action.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => removeSection(index)}
                                className="bg-red-500 hover:bg-red-600 text-white"
                            >
                                Remove
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </Collapsible>
    );
}
