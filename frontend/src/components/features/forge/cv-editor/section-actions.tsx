'use client';

import { useState } from 'react';
import { Library, Plus } from 'lucide-react';

import { Button } from '@/ui/shadcn/button';
import { useCvDocumentStore } from '@/lib/store/use-cv-document';
import { cvImport } from '@/lib/helpers/cv-import';
import type { SectionType } from '@/lib/types/cv-document-types';

import { AddFromLibrarySheet } from './add-from-library-sheet';

interface SectionActionsProps {
    sectionIndex: number;
    sectionType: SectionType;
}

export function SectionActions({
    sectionIndex,
    sectionType,
}: SectionActionsProps) {
    const [libraryOpen, setLibraryOpen] = useState(false);
    const addItem = useCvDocumentStore((s) => s.addItem);

    function handleAddNew() {
        const item = cvImport.emptyItem(sectionType);
        addItem(sectionIndex, item);
    }

    return (
        <div className="mt-2 flex items-center gap-2">
            <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-ash hover:text-flux"
                onClick={handleAddNew}
            >
                <Plus className="mr-1 h-3 w-3" />
                Add new
            </Button>

            <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-ash hover:text-flux"
                onClick={() => setLibraryOpen(true)}
            >
                <Library className="mr-1 h-3 w-3" />
                From library
            </Button>

            <AddFromLibrarySheet
                open={libraryOpen}
                onOpenChange={setLibraryOpen}
                sectionIndex={sectionIndex}
                sectionType={sectionType}
            />
        </div>
    );
}
