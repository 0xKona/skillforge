'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    ChevronDown,
    GripVertical,
    Trash2,
    BookmarkPlus,
    ExternalLink,
    RefreshCw,
    Unlink,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/ui/shadcn/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/ui/shadcn/dropdown-menu';
import { useCvDocumentStore } from '@/lib/store/use-cv-document';
import { useUpdateIngot } from '@/hooks/use-ingots';
import { cvImport } from '@/lib/helpers/cv-import';
import { SECTION_SCHEMAS, sectionAccent } from '@/lib/constants/cv-constants';
import { springs } from '@/lib/constants/cv-editor-animations';
import type { DocumentItem, SectionType } from '@/lib/types/cv-document-types';
import { cn } from '@/lib/utils';

import { ItemFields } from './item-fields';
import { SubItemList } from './sub-item-list';
import { QuickIngotDialog } from './quick-ingot-dialog';

interface ItemBlockProps {
    item: DocumentItem;
    sectionIndex: number;
    itemIndex: number;
    sectionType: SectionType;
}

function getItemHeadline(item: DocumentItem, sectionType: SectionType): string {
    const schema = SECTION_SCHEMAS[sectionType];
    const fieldKeys = Object.keys(schema.fields);
    const primaryKey =
        fieldKeys.find((k) => schema.fields[k].required) ?? fieldKeys[0];
    const primary = item.fields[primaryKey] ?? '';

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
    const [saveToIngotOpen, setSaveToIngotOpen] = useState(false);

    const removeItem = useCvDocumentStore((s) => s.removeItem);
    const setItemSourceIngotId = useCvDocumentStore(
        (s) => s.setItemSourceIngotId
    );
    const updateIngot = useUpdateIngot();

    const schema = SECTION_SCHEMAS[sectionType];
    const accent = sectionAccent[sectionType];

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

    const hasSource = !!item.sourceIngotId;

    const handleSyncToIngot = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!item.sourceIngotId) return;
        try {
            const ingotData = cvImport.toIngot(item, sectionType);
            await updateIngot.mutateAsync({
                id: item.sourceIngotId,
                name: ingotData.name,
                content: ingotData.content,
            });
            toast.success(`Synced changes to "${ingotData.name}" in Anvil`);
        } catch {
            toast.error('Failed to sync changes to Anvil');
        }
    };

    const handleUnlinkIngot = (e: React.MouseEvent) => {
        e.stopPropagation();
        setItemSourceIngotId(sectionIndex, itemIndex, undefined);
        toast.info('Item unlinked from Anvil library');
    };

    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                className={cn(
                    'group relative rounded-md border bg-gunmetal transition-colors duration-150',
                    isDragging
                        ? 'border-border-hot opacity-90 shadow-md'
                        : expanded
                          ? 'border-border-hot bg-flux/5'
                          : 'border-border-default hover:border-border-warm'
                )}
            >
                {/* Accent line */}
                <div
                    className={cn(
                        'absolute left-0 top-0 h-full w-0.5 rounded-l-md',
                        accent
                    )}
                />

                {/* Collapsed header row */}
                <div className="flex items-center gap-2 px-3 py-2.5 pl-3">
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
                        <span className="flex-1 min-w-0 text-sm text-text-primary truncate">
                            {getItemHeadline(item, sectionType)}
                        </span>

                        {hasSource && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        type="button"
                                        onClick={(e) => e.stopPropagation()}
                                        className="shrink-0 inline-flex items-center gap-1 rounded-full border border-flux/30 bg-flux/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-flux hover:bg-flux/20 transition-colors"
                                        title="Linked to Anvil Ingot"
                                    >
                                        <span>Linked Ingot</span>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-48"
                                >
                                    <DropdownMenuLabel className="text-[11px] font-medium uppercase tracking-wider text-ash">
                                        Library Connection
                                    </DropdownMenuLabel>
                                    <DropdownMenuItem
                                        onClick={handleSyncToIngot}
                                        className="text-xs"
                                    >
                                        <RefreshCw className="mr-2 h-3.5 w-3.5 text-flux" />
                                        Sync edits to Anvil
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        asChild
                                        className="text-xs"
                                    >
                                        <a
                                            href={`/anvil/edit/?id=${item.sourceIngotId}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center"
                                        >
                                            <ExternalLink className="mr-2 h-3.5 w-3.5 text-ash" />
                                            View in Anvil
                                        </a>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={handleUnlinkIngot}
                                        className="text-xs text-ash hover:text-red-400"
                                    >
                                        <Unlink className="mr-2 h-3.5 w-3.5" />
                                        Unlink from library
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                        <ChevronDown
                            className={cn(
                                'h-3.5 w-3.5 shrink-0 text-ash transition-transform duration-150',
                                expanded && 'rotate-180'
                            )}
                        />
                    </button>

                    {!hasSource && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:text-flux transition-opacity"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSaveToIngotOpen(true);
                            }}
                            aria-label="Save as Ingot to Anvil"
                            title="Save as Ingot to Anvil"
                        >
                            <BookmarkPlus className="h-3 w-3" />
                        </Button>
                    )}

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity"
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
                            <div className="border-t border-border-default px-3 pb-3 pt-3 pl-3">
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

            <QuickIngotDialog
                open={saveToIngotOpen}
                onOpenChange={setSaveToIngotOpen}
                sectionType={sectionType}
                initialItem={item}
                onIngotCreated={(newIngot) => {
                    setItemSourceIngotId(sectionIndex, itemIndex, newIngot.id);
                }}
            />
        </>
    );
}
