'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Eye, Redo2, Save, Undo2 } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/ui/shadcn/button';
import { Input } from '@/ui/shadcn/input';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/ui/shadcn/tooltip';
import { useCvDocumentStore } from '@/lib/store/use-cv-document';
import { useUpdateCv } from '@/hooks/use-cvs';
import { springs, fadeIn } from '@/lib/constants/cv-editor-animations';
import { cn } from '@/lib/utils';
import type { CvDocument } from '@/lib/types/cv-document-types';

import { SectionList } from './section-list';
import { AddSectionPicker } from './add-section-picker';
import { PreviewPanel } from '@/components/features/pdf/cv-document/preview-panel';

export function CvEditor() {
    const document = useCvDocumentStore((s) => s.document);
    const isDirty = useCvDocumentStore((s) => s.isDirty);
    const updateTitle = useCvDocumentStore((s) => s.updateTitle);
    const undo = useCvDocumentStore((s) => s.undo);
    const redo = useCvDocumentStore((s) => s.redo);
    const canUndo = useCvDocumentStore((s) => s.history.length > 0);
    const canRedo = useCvDocumentStore((s) => s.future.length > 0);
    const markSaved = useCvDocumentStore((s) => s.markSaved);

    const [previewOpen, setPreviewOpen] = useState(false);
    const updateCv = useUpdateCv();

    // Keyboard shortcuts
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            const mod = e.metaKey || e.ctrlKey;
            if (mod && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                undo();
            }
            if (mod && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
                e.preventDefault();
                redo();
            }
            if (mod && e.key === 's') {
                e.preventDefault();
                // Save immediately
                const doc = useCvDocumentStore.getState().document;
                if (doc && 'id' in doc && doc.id) {
                    updateCv.mutate(doc as CvDocument, {
                        onSuccess: () => markSaved(),
                    });
                }
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo, updateCv, markSaved]);

    function handleSave() {
        const doc = useCvDocumentStore.getState().document;
        if (!doc || !('id' in doc) || !doc.id) return;
        updateCv.mutate(doc as CvDocument, {
            onSuccess: () => markSaved(),
        });
    }

    const handleTitleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            updateTitle(e.target.value);
        },
        [updateTitle]
    );

    if (!document) return null;

    return (
        <TooltipProvider delayDuration={300}>
            <div className="min-h-screen bg-graphite">
                {/* Toolbar */}
                <header className="sticky top-0 z-40 border-b border-border-default bg-graphite/95 backdrop-blur-sm">
                    <div className="mx-auto flex h-12 max-w-3xl items-center gap-3 px-4">
                        {/* Back */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    asChild
                                >
                                    <Link href="/forge">
                                        <ArrowLeft className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Back to library</TooltipContent>
                        </Tooltip>

                        {/* Title */}
                        <Input
                            value={document.title}
                            onChange={handleTitleChange}
                            className="h-8 border-none bg-transparent px-2 text-sm font-semibold shadow-none focus-visible:ring-1 focus-visible:ring-border-hot"
                            placeholder="Untitled CV"
                        />

                        {/* Save status */}
                        <span
                            className={cn(
                                'text-xs whitespace-nowrap transition-colors duration-150',
                                isDirty ? 'text-flux' : 'text-ash'
                            )}
                        >
                            {isDirty ? 'Unsaved changes' : 'Saved'}
                        </span>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={undo}
                                        disabled={!canUndo}
                                    >
                                        <Undo2 className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Undo (Cmd+Z)</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={redo}
                                        disabled={!canRedo}
                                    >
                                        <Redo2 className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Redo (Cmd+Shift+Z)
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => setPreviewOpen(true)}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Preview</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={handleSave}
                                        disabled={!isDirty}
                                    >
                                        <Save className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Save (Cmd+S)</TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                </header>

                {/* Canvas */}
                <motion.main
                    className="mx-auto max-w-3xl px-4 py-6"
                    variants={fadeIn}
                    initial="initial"
                    animate="animate"
                    transition={springs.gentle}
                >
                    <SectionList />
                    <AddSectionPicker />
                </motion.main>
            </div>

            <PreviewPanel open={previewOpen} onOpenChange={setPreviewOpen} />
        </TooltipProvider>
    );
}
