'use client';

import dynamic from 'next/dynamic';
import { Download } from 'lucide-react';

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/ui/shadcn/sheet';
import { Button } from '@/ui/shadcn/button';
import { useCvDocumentStore } from '@/lib/store/use-cv-document';

// Dynamically import PDFViewer to avoid SSR issues with @react-pdf/renderer
const PDFViewer = dynamic(
    () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
    { ssr: false }
);

// Dynamically import PdfDocument to avoid SSR bundling of react-pdf
const PdfDocument = dynamic(
    () =>
        import('@/components/features/pdf/cv-document/pdf-document').then(
            (mod) => mod.PdfDocument
        ),
    { ssr: false }
);

interface PreviewPanelProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

/**
 * Live PDF preview panel that shows the current document state.
 * Opens as a sheet from the right. Renders the PDF inline via PDFViewer.
 */
export function PreviewPanel({ open, onOpenChange }: PreviewPanelProps) {
    const document = useCvDocumentStore((s) => s.document);

    if (!document) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                className="w-[500px] bg-forge-panel border-forge-border sm:max-w-[500px] p-0"
            >
                <div className="flex h-full flex-col">
                    <SheetHeader className="border-b border-forge-border px-4 py-3">
                        <div className="flex items-center justify-between">
                            <SheetTitle className="text-forge-text text-sm">
                                Preview
                            </SheetTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs text-forge-text-muted hover:text-forge-accent"
                            >
                                <Download className="mr-1 h-3 w-3" />
                                Download PDF
                            </Button>
                        </div>
                    </SheetHeader>

                    <div className="flex-1 overflow-hidden bg-forge-surface p-4">
                        <PDFViewer
                            style={{
                                width: '100%',
                                height: '100%',
                                border: 'none',
                            }}
                        >
                            <PdfDocument document={document} />
                        </PDFViewer>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
