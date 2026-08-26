'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/ui/shadcn/sheet';
import { Input } from '@/ui/shadcn/input';
import { ScrollArea } from '@/ui/shadcn/scroll-area';
import { useCvDocumentStore } from '@/lib/store/use-cv-document';
import { cvImport } from '@/lib/helpers/cv-import';
import { SECTION_META } from '@/lib/constants/cv-constants';
import type { Ingot } from '@/lib/types/ingot-types';
import type { SectionType } from '@/lib/types/cv-document-types';

interface AddFromLibrarySheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    sectionIndex: number;
    sectionType: SectionType;
}

// TODO: Replace with actual data fetching via React Query (useIngots hook)
const PLACEHOLDER_INGOTS: Ingot[] = [];

/**
 * Sheet component for selecting ingots from the user's library.
 *
 * NOTE: This component expects a `useIngots` hook to be available for data fetching.
 * For now it uses an empty placeholder — the actual data fetching
 * will be wired in when the page-level component is built.
 */
export function AddFromLibrarySheet({
    open,
    onOpenChange,
    sectionIndex,
    sectionType,
}: AddFromLibrarySheetProps) {
    const [search, setSearch] = useState('');
    const addItem = useCvDocumentStore((s) => s.addItem);
    const meta = SECTION_META[sectionType];

    const ingotType = `ingot_${sectionType}` as const;
    const filtered = useMemo(
        () =>
            PLACEHOLDER_INGOTS.filter((i) => i.type === ingotType).filter(
                (i) =>
                    !search ||
                    i.name.toLowerCase().includes(search.toLowerCase())
            ),
        [ingotType, search]
    );

    function handleSelect(ingot: Ingot) {
        const item = cvImport.fromIngot(ingot);
        addItem(sectionIndex, item);
        onOpenChange(false);
        setSearch('');
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                className="w-[400px] bg-forge-panel border-forge-border sm:max-w-[400px]"
            >
                <SheetHeader>
                    <SheetTitle className="text-forge-text">
                        Add from library
                    </SheetTitle>
                </SheetHeader>

                <div className="mt-4 space-y-3">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2 h-4 w-4 text-forge-text-muted" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={`Search ${meta.defaultTitle.toLowerCase()}...`}
                            className="h-8 pl-8 text-sm bg-forge-card border-forge-border focus-visible:ring-1 focus-visible:ring-forge-border-hot"
                        />
                    </div>

                    {/* Results */}
                    <ScrollArea className="h-[calc(100vh-180px)]">
                        {filtered.length === 0 ? (
                            <p className="py-8 text-center text-sm text-forge-text-muted">
                                {PLACEHOLDER_INGOTS.length === 0
                                    ? `No ${meta.defaultTitle.toLowerCase()} in your library yet.`
                                    : 'No results match your search.'}
                            </p>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {filtered.map((ingot) => (
                                    <button
                                        key={ingot.id}
                                        onClick={() => handleSelect(ingot)}
                                        className="rounded-md border border-forge-border bg-forge-card p-3 text-left transition-colors hover:border-forge-border-warm"
                                    >
                                        <p className="text-sm font-medium text-forge-text">
                                            {ingot.name}
                                        </p>
                                        <p className="mt-0.5 text-xs text-forge-text-muted">
                                            {ingot.content.billets.length}{' '}
                                            entries
                                        </p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </SheetContent>
        </Sheet>
    );
}
