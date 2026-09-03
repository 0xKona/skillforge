'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, Redo2, Save, Undo2 } from 'lucide-react';
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
import { cn } from '@/lib/utils';
import type { CvDocument, NewCvDocument } from '@/lib/types/cv-document-types';
import { forgeCvPath } from '@/lib/constants/routing';
import { PdfPreviewDialog } from '@/components/features/pdf/cv-document/pdf-preview-dialog';
import { CV_FONT_OPTIONS } from '@/lib/pdf/font-options';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/ui/shadcn/select';

import { EditorShell } from './editor-shell';

export function CvEditor() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const document = useCvDocumentStore((s) => s.document);
    const isDirty = useCvDocumentStore((s) => s.isDirty);
    const updateTitle = useCvDocumentStore((s) => s.updateTitle);
    const updateFontFamily = useCvDocumentStore((s) => s.updateFontFamily);
    const undo = useCvDocumentStore((s) => s.undo);
    const redo = useCvDocumentStore((s) => s.redo);
    const canUndo = useCvDocumentStore((s) => s.history.length > 0);
    const canRedo = useCvDocumentStore((s) => s.future.length > 0);
    const markSaved = useCvDocumentStore((s) => s.markSaved);

    const [discardOpen, setDiscardOpen] = useState(false);
    const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);
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
                    router.replace(forgeCvPath(created.id));
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
            <div className="flex min-h-[calc(100vh-3.5rem)] flex-col">
                {/* Toolbar */}
                <header
                    className={cn(
                        'sticky top-14 z-30 border-b border-border-default bg-graphite/95 backdrop-blur-sm transition-colors',
                        isDirty && 'border-b-flux/40'
                    )}
                >
                    <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4 md:px-6">
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
                            className="h-8 flex-1 border-none bg-transparent px-2 text-sm font-semibold shadow-none focus-visible:ring-1 focus-visible:ring-border-hot"
                            placeholder="Untitled CV"
                        />
                        <Select
                            value={
                                document.content.settings?.fontFamily ?? 'inter'
                            }
                            onValueChange={updateFontFamily}
                        >
                            <SelectTrigger className="hidden h-8 w-36 text-xs sm:flex">
                                <SelectValue placeholder="Font" />
                            </SelectTrigger>
                            <SelectContent>
                                {CV_FONT_OPTIONS.map((font) => (
                                    <SelectItem key={font.id} value={font.id}>
                                        {font.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Status pill */}
                        <span
                            className={cn(
                                'hidden whitespace-nowrap rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-colors sm:inline-block',
                                isDirty
                                    ? 'bg-flux/10 text-flux'
                                    : 'bg-slag text-ash'
                            )}
                        >
                            {isDirty ? 'Unsaved' : 'Saved'}
                        </span>

                        {/* Separator */}
                        <div className="h-5 w-px bg-border-default" />

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                            {/* Undo */}
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

                            {/* Redo */}
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

                            <div className="h-5 w-px bg-border-default" />

                            {/* Download PDF */}
                            {document && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            disabled={isNew}
                                            onClick={() =>
                                                setPdfPreviewOpen(true)
                                            }
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {isNew
                                            ? 'Save first to download'
                                            : 'Preview and download PDF'}
                                    </TooltipContent>
                                </Tooltip>
                            )}

                            {/* Save */}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={cn(
                                            'h-8 w-8',
                                            !saveDisabled &&
                                                'text-flux hover:text-flux-hover'
                                        )}
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

                {/* Shell (editor + preview) */}
                <EditorShell />
            </div>

            <PdfPreviewDialog
                document={document}
                open={pdfPreviewOpen}
                onOpenChange={setPdfPreviewOpen}
            />

            {/* Discard new CV dialog */}
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
