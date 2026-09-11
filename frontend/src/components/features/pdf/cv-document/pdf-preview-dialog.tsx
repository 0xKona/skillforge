'use client';

import { useState } from 'react';
import { pdf, PDFViewer } from '@react-pdf/renderer';
import { Download } from 'lucide-react';

import { Button } from '@/ui/shadcn/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/ui/shadcn/dialog';
import { cvPreviewHelpers } from '@/lib/helpers/cv-preview';
import type { CvDocument, NewCvDocument } from '@/lib/types/cv-document-types';

import { PdfDocument } from './pdf-document';

interface PdfPreviewDialogProps {
    document: CvDocument | NewCvDocument;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function PdfPreviewDialog({
    document,
    open,
    onOpenChange,
}: PdfPreviewDialogProps) {
    const [isDownloading, setIsDownloading] = useState(false);

    async function handleDownload() {
        setIsDownloading(true);
        try {
            const blob = await pdf(
                <PdfDocument document={document} />
            ).toBlob();
            const url = URL.createObjectURL(blob);
            const anchor = window.document.createElement('a');
            anchor.href = url;
            anchor.download = `${cvPreviewHelpers.safeFilename(document.title)}.pdf`;
            anchor.click();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        } finally {
            setIsDownloading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex h-[min(90vh,900px)] max-w-5xl flex-col gap-0 overflow-hidden p-0">
                <DialogHeader className="shrink-0 border-b border-border-default px-6 py-4">
                    <DialogTitle>PDF preview</DialogTitle>
                    <DialogDescription>
                        Review the exported document before downloading it.
                    </DialogDescription>
                </DialogHeader>
                <div className="min-h-0 flex-1 bg-graphite p-4">
                    <PDFViewer
                        showToolbar={false}
                        className="h-full w-full rounded-md border border-border-default"
                    >
                        <PdfDocument document={document} />
                    </PDFViewer>
                </div>
                <DialogFooter className="shrink-0 border-t border-border-default px-6 py-4">
                    <Button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="bg-flux text-white hover:bg-flux-hover"
                    >
                        <Download className="h-4 w-4" />
                        {isDownloading ? 'Preparing PDF...' : 'Download PDF'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
