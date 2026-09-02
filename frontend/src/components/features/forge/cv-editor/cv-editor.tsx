'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowLeft, Eye, Redo2, Save, Undo2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/ui/shadcn/button';
import { Input } from '@/ui/shadcn/input';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/ui/shadcn/tooltip';
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
import { useCvDocumentStore } from '@/lib/store/use-cv-document';
import { useCreateCv, useUpdateCv, cvKeys } from '@/hooks/use-cvs';
import { springs, fadeIn } from '@/lib/constants/cv-editor-animations';
import { cn } from '@/lib/utils';
import type { CvDocument, NewCvDocument } from '@/lib/types/cv-document-types';

import { SectionList } from './section-list';
import { AddSectionPicker } from './add-section-picker';
import { PreviewPanel } from '@/components/features/pdf/cv-document/preview-panel';

export function CvEditor() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const document = useCvDocumentStore((s) => s.document);
    const isDirty = useCvDocumentStore((s) => s.isDirty);
    const updateTitle = useCvDocumentStore((s) => s.updateTitle);
    const undo = useCvDocumentStore((s) => s.undo);
    const redo = useCvDocumentStore((s) => s.redo);
    const canUndo = useCvDocumentStore((s) => s.history.length > 0);
    const canRedo = useCvDocumentStore((s) => s.future.length > 0);
    const markSaved = useCvDocumentStore((s) => s.markSaved);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [discardOpen, setDiscardOpen] = useState(false);
    const createCv = useCreateCv();
    const updateCv = useUpdateCv();

    const hasId = !!document && 'id' in document && !!document.id;
    const isNew = !hasId;
    const titleMissing = isNew && (!document || document.title.trim() === '');
    const saveDisabled = !isDirty || titleMissing;

    const handleSave = useCallback(() => {
        const doc = useCvDocumentStore.getState().document;
        if (!doc) return;
        if (isNew) {
            if (doc.title.trim() === '') return;
            createCv.mutate(doc as NewCvDocument, {
                onSuccess: (created) => {
                    queryClient.setQueryData(
                        cvKeys.detail(created.id),
                        created
                    );
                    markSaved();
                    router.replace(`/forge/cv/${created.id}`);
                },
            });
        } else {
            updateCv.mutate(doc as CvDocument, {
                onSuccess: (updated) => {
                    queryClient.setQueryData(
                        cvKeys.detail(updated.id),
                        updated
                    );
                    markSaved();
                },
            });
        }
    }, [isNew, createCv, updateCv, queryClient, markSaved, router]);

    function handleBackClick() {
        if (isNew && isDirty) {
            setDiscardOpen(true);
            return;
        }
        router.push('/forge');
    }

    function handleDiscardConfirm() {
        setDiscardOpen(false);
        router.push('/forge');
    }

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
                handleSave();
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo, handleSave]);

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
                                    onClick={handleBackClick}
                                >
                                    <ArrowLeft className="h-4 w-4" />
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
                                        disabled={saveDisabled}
                                    >
                                        <Save className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {titleMissing
                                        ? 'Add a title to save'
                                        : 'Save (Cmd+S)'}
                                </TooltipContent>
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

            <AlertDialog open={discardOpen} onOpenChange={setDiscardOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Discard new CV?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Your changes will be lost. This CV has not been
                            saved yet.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Keep editing</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-500 hover:bg-red-600 text-white"
                            onClick={handleDiscardConfirm}
                        >
                            Discard
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </TooltipProvider>
    );
}
