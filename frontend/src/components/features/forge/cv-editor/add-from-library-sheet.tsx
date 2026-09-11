'use client';

import { useMemo, useState } from 'react';
import { Search, Hammer, ArrowUpRight, Check, BookOpen } from 'lucide-react';

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/ui/shadcn/sheet';
import { Input } from '@/ui/shadcn/input';
import { Button } from '@/ui/shadcn/button';
import { ScrollArea } from '@/ui/shadcn/scroll-area';
import { Skeleton } from '@/ui/shadcn/skeleton';
import { useCvDocumentStore } from '@/lib/store/use-cv-document';
import { useIngots } from '@/hooks/use-ingots';
import { cvImport } from '@/lib/helpers/cv-import';
import { SECTION_META } from '@/lib/constants/cv-constants';
import type { Ingot, IngotType } from '@/lib/types/ingot-types';
import type { SectionType } from '@/lib/types/cv-document-types';
import { QuickIngotDialog } from './quick-ingot-dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface AddFromLibrarySheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    sectionIndex: number;
    sectionType: SectionType;
}

/**
 * Master-detail workbench sheet for browsing, previewing, and selectively
 * importing ingots and billets from the user's Anvil library.
 */
export function AddFromLibrarySheet({
    open,
    onOpenChange,
    sectionIndex,
    sectionType,
}: AddFromLibrarySheetProps) {
    const [search, setSearch] = useState('');
    const [selectedIngotId, setSelectedIngotId] = useState<string | null>(null);
    const [selectionByIngot, setSelectionByIngot] = useState<
        Record<string, string[]>
    >({});
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const addItem = useCvDocumentStore((s) => s.addItem);
    const meta = SECTION_META[sectionType];

    // Fetch ingots matching this section type
    const ingotType = `ingot_${sectionType}` as IngotType;
    const { data: ingots = [], isLoading } = useIngots(ingotType);

    const filtered = useMemo(
        () =>
            ingots.filter(
                (i) =>
                    !search ||
                    i.name.toLowerCase().includes(search.toLowerCase())
            ),
        [ingots, search]
    );

    // Default select first ingot if none selected
    const activeIngot = useMemo(() => {
        if (!selectedIngotId) return filtered[0] ?? null;
        return (
            ingots.find((i) => i.id === selectedIngotId) ?? filtered[0] ?? null
        );
    }, [ingots, filtered, selectedIngotId]);

    // Selected billets for the active ingot
    const selectedBilletIds = useMemo(() => {
        if (!activeIngot) return [];
        return (
            selectionByIngot[activeIngot.id] ??
            activeIngot.content.billets.map((b) => b.id)
        );
    }, [activeIngot, selectionByIngot]);

    const handleToggleBillet = (id: string) => {
        if (!activeIngot) return;
        const current = selectedBilletIds;
        const next = current.includes(id)
            ? current.filter((bId) => bId !== id)
            : [...current, id];
        setSelectionByIngot((prev) => ({ ...prev, [activeIngot.id]: next }));
    };

    const handleToggleAllBillets = () => {
        if (!activeIngot) return;
        const allIds = activeIngot.content.billets.map((b) => b.id);
        const next = selectedBilletIds.length === allIds.length ? [] : allIds;
        setSelectionByIngot((prev) => ({ ...prev, [activeIngot.id]: next }));
    };

    const handleImport = () => {
        if (!activeIngot) return;
        const item =
            selectedBilletIds.length > 0
                ? cvImport.fromIngotWithBillets(activeIngot, selectedBilletIds)
                : cvImport.fromIngot(activeIngot);

        addItem(sectionIndex, item);
        toast.success(`Added "${activeIngot.name}" to CV`);
        onOpenChange(false);
        setSearch('');
    };

    const handleIngotCreated = (newIngot: Ingot) => {
        const item = cvImport.fromIngot(newIngot);
        addItem(sectionIndex, item);
        onOpenChange(false);
    };

    return (
        <>
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent
                    side="right"
                    className="w-full sm:max-w-2xl bg-gunmetal border-border-default p-0 text-text-primary flex flex-col"
                >
                    <SheetHeader className="border-b border-border-default px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <SheetTitle className="text-base font-semibold text-text-primary">
                                    Anvil Library Workbench
                                </SheetTitle>
                                <p className="text-xs text-ash">
                                    Select and customize{' '}
                                    {meta.defaultTitle.toLowerCase()} from your
                                    canonical library.
                                </p>
                            </div>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setCreateDialogOpen(true)}
                                className="border-border-default text-xs text-flux hover:text-flux-hover hover:border-flux/50"
                            >
                                <Hammer className="mr-1.5 h-3.5 w-3.5" />
                                Forge New Ingot
                            </Button>
                        </div>
                    </SheetHeader>

                    {/* Two-Pane Body */}
                    <div className="grid flex-1 grid-cols-1 divide-y sm:grid-cols-5 sm:divide-y-0 sm:divide-x divide-border-default min-h-0">
                        {/* Left Pane: Ingot List (2 cols) */}
                        <div className="sm:col-span-2 flex flex-col min-h-0 p-4 space-y-3">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-ash" />
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder={`Search ${meta.defaultTitle.toLowerCase()}...`}
                                    className="h-8 pl-8 text-xs bg-crucible border-border-default focus-visible:ring-1 focus-visible:ring-border-hot"
                                />
                            </div>

                            <ScrollArea className="flex-1 pr-2">
                                {isLoading ? (
                                    <div className="space-y-2">
                                        <Skeleton className="h-14 w-full" />
                                        <Skeleton className="h-14 w-full" />
                                        <Skeleton className="h-14 w-full" />
                                    </div>
                                ) : filtered.length === 0 ? (
                                    <div className="py-10 text-center space-y-2">
                                        <BookOpen className="mx-auto h-8 w-8 text-ash/40" />
                                        <p className="text-xs text-ash">
                                            {ingots.length === 0
                                                ? `No ${meta.defaultTitle.toLowerCase()} in your library yet.`
                                                : 'No matching ingots found.'}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-1.5">
                                        {filtered.map((ingot) => {
                                            const isSelected =
                                                activeIngot?.id === ingot.id;
                                            return (
                                                <button
                                                    key={ingot.id}
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedIngotId(
                                                            ingot.id
                                                        )
                                                    }
                                                    className={cn(
                                                        'w-full text-left rounded-md border p-2.5 transition-all text-xs',
                                                        isSelected
                                                            ? 'border-flux bg-flux/10'
                                                            : 'border-border-default bg-crucible hover:border-border-warm'
                                                    )}
                                                >
                                                    <p
                                                        className={cn(
                                                            'font-medium truncate',
                                                            isSelected
                                                                ? 'text-flux font-semibold'
                                                                : 'text-text-primary'
                                                        )}
                                                    >
                                                        {ingot.name}
                                                    </p>
                                                    <p className="mt-0.5 font-mono text-[10px] text-ash">
                                                        {
                                                            ingot.content
                                                                .billets.length
                                                        }{' '}
                                                        {ingot.content.billets
                                                            .length === 1
                                                            ? 'billet'
                                                            : 'billets'}
                                                    </p>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </ScrollArea>
                        </div>

                        {/* Right Pane: Ingot Inspector & Selective Import (3 cols) */}
                        <div className="sm:col-span-3 flex flex-col min-h-0 bg-graphite/40">
                            {activeIngot ? (
                                <div className="flex flex-col h-full">
                                    {/* Inspector Header */}
                                    <div className="border-b border-border-default p-4 space-y-2">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <h3 className="text-sm font-semibold text-text-primary">
                                                    {activeIngot.name}
                                                </h3>
                                                <span className="font-mono text-[10px] uppercase tracking-wider text-ash">
                                                    {activeIngot.type.replace(
                                                        'ingot_',
                                                        ''
                                                    )}{' '}
                                                    Ingot
                                                </span>
                                            </div>
                                            <a
                                                href={`/anvil/edit/?id=${activeIngot.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-[11px] text-ash hover:text-text-primary transition-colors"
                                            >
                                                <span>Edit in Anvil</span>
                                                <ArrowUpRight className="h-3 w-3" />
                                            </a>
                                        </div>

                                        {/* Top-Level Fields Summary */}
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ash">
                                            {Object.entries(
                                                activeIngot.content.fields
                                            ).map(([key, field]) => {
                                                if (!field.value) return null;
                                                return (
                                                    <div
                                                        key={key}
                                                        className="inline-flex items-center gap-1"
                                                    >
                                                        <span className="capitalize text-ash/70">
                                                            {key}:
                                                        </span>
                                                        <span className="text-text-primary">
                                                            {field.value}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Billets Selective List */}
                                    <div className="flex-1 min-h-0 p-4 flex flex-col space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-ash">
                                                Billets to Include (
                                                {selectedBilletIds.length}/
                                                {
                                                    activeIngot.content.billets
                                                        .length
                                                }
                                                )
                                            </span>
                                            {activeIngot.content.billets
                                                .length > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleToggleAllBillets
                                                    }
                                                    className="text-[11px] text-flux hover:underline"
                                                >
                                                    {selectedBilletIds.length ===
                                                    activeIngot.content.billets
                                                        .length
                                                        ? 'Deselect All'
                                                        : 'Select All'}
                                                </button>
                                            )}
                                        </div>

                                        <ScrollArea className="flex-1 pr-2">
                                            {activeIngot.content.billets
                                                .length === 0 ? (
                                                <p className="py-8 text-center text-xs text-ash">
                                                    No specific billets defined
                                                    on this Ingot. Top-level
                                                    details will be imported.
                                                </p>
                                            ) : (
                                                <div className="space-y-2">
                                                    {activeIngot.content.billets.map(
                                                        (billet) => {
                                                            const isChecked =
                                                                selectedBilletIds.includes(
                                                                    billet.id
                                                                );
                                                            const fields =
                                                                Object.entries(
                                                                    billet.fields
                                                                );
                                                            const titleField =
                                                                fields.find(
                                                                    ([k]) =>
                                                                        k
                                                                            .toLowerCase()
                                                                            .includes(
                                                                                'title'
                                                                            ) ||
                                                                        k
                                                                            .toLowerCase()
                                                                            .includes(
                                                                                'role'
                                                                            )
                                                                )?.[1]?.value;
                                                            const descField =
                                                                fields.find(
                                                                    ([k]) =>
                                                                        k
                                                                            .toLowerCase()
                                                                            .includes(
                                                                                'desc'
                                                                            )
                                                                )?.[1]?.value;

                                                            return (
                                                                <div
                                                                    key={
                                                                        billet.id
                                                                    }
                                                                    onClick={() =>
                                                                        handleToggleBillet(
                                                                            billet.id
                                                                        )
                                                                    }
                                                                    className={cn(
                                                                        'cursor-pointer rounded-md border p-2.5 transition-all text-xs space-y-1',
                                                                        isChecked
                                                                            ? 'border-flux/60 bg-flux/5'
                                                                            : 'border-border-default bg-crucible/50 opacity-60 hover:opacity-100'
                                                                    )}
                                                                >
                                                                    <div className="flex items-center gap-2">
                                                                        <div
                                                                            className={cn(
                                                                                'h-4 w-4 rounded flex items-center justify-center shrink-0 border',
                                                                                isChecked
                                                                                    ? 'bg-flux border-flux text-white'
                                                                                    : 'border-border-default bg-graphite'
                                                                            )}
                                                                        >
                                                                            {isChecked && (
                                                                                <Check className="h-3 w-3" />
                                                                            )}
                                                                        </div>
                                                                        <span className="font-semibold text-text-primary truncate">
                                                                            {titleField ||
                                                                                'Billet Entry'}
                                                                        </span>
                                                                    </div>
                                                                    {descField && (
                                                                        <p className="text-[11px] text-ash line-clamp-2 pl-6">
                                                                            {
                                                                                descField
                                                                            }
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            )}
                                        </ScrollArea>
                                    </div>

                                    {/* Action Footer */}
                                    <div className="border-t border-border-default p-4 flex items-center justify-between">
                                        <span className="text-xs text-ash">
                                            {selectedBilletIds.length}{' '}
                                            {selectedBilletIds.length === 1
                                                ? 'billet'
                                                : 'billets'}{' '}
                                            selected
                                        </span>
                                        <Button
                                            size="sm"
                                            onClick={handleImport}
                                            className="bg-flux text-white hover:bg-flux-hover text-xs font-medium"
                                        >
                                            Import to CV
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                                    <BookOpen className="h-10 w-10 text-ash/30" />
                                    <p className="mt-2 text-xs text-ash">
                                        Select an Ingot from the left to inspect
                                        its billets.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Quick Ingot Dialog */}
            <QuickIngotDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                sectionType={sectionType}
                onIngotCreated={handleIngotCreated}
            />
        </>
    );
}
