'use client';

import {
    FileText,
    ZoomIn,
    ZoomOut,
    Copy,
    Check,
    AlertTriangle,
    SlidersHorizontal,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useCvPreviewData } from '@/hooks/use-cv-preview-data';
import { useCvDocumentStore } from '@/lib/store/use-cv-document';
import { generateAtsPlainText } from '@/lib/helpers/ats-export';
import { Button } from '@/ui/shadcn/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/ui/shadcn/tooltip';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/ui/shadcn/dropdown-menu';
import { CvPreviewSheet } from './cv-preview-sheet';

const A4_WIDTH = 794;
const A4_HEIGHT = 1123;
const LETTER_WIDTH = 816;
const LETTER_HEIGHT = 1056;

export function CvPreviewPane() {
    const data = useCvPreviewData();
    const updateSettings = useCvDocumentStore((s) => s.updateSettings);

    const canvasRef = useRef<HTMLDivElement>(null);
    const [canvasWidth, setCanvasWidth] = useState(A4_WIDTH);
    const [zoomMode, setZoomMode] = useState<'fit' | 'manual'>('fit');
    const [manualZoom, setManualZoom] = useState(0.85);
    const [measuredHeight, setMeasuredHeight] = useState(A4_HEIGHT);
    const [copiedAts, setCopiedAts] = useState(false);
    const [dismissSpillover, setDismissSpillover] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const updateWidth = () => setCanvasWidth(canvas.clientWidth);
        updateWidth();

        const observer = new ResizeObserver(updateWidth);
        observer.observe(canvas);
        return () => observer.disconnect();
    }, []);

    const paperFormat = data?.settings?.paperFormat ?? 'a4';
    const pageWidth = paperFormat === 'letter' ? LETTER_WIDTH : A4_WIDTH;
    const pageHeight = paperFormat === 'letter' ? LETTER_HEIGHT : A4_HEIGHT;

    const fitScale = Math.min(
        1,
        Math.max(0.35, (canvasWidth - 32) / pageWidth)
    );
    const activeScale = zoomMode === 'fit' ? fitScale : manualZoom;

    // Multi-page and spillover calculations
    const pageCount = Math.max(1, Math.ceil(measuredHeight / pageHeight));
    const remainder =
        measuredHeight > pageHeight ? measuredHeight % pageHeight : 0;
    const isSpillover =
        !dismissSpillover &&
        measuredHeight > pageHeight &&
        remainder > 0 &&
        remainder < 150;

    const handleCopyAts = async () => {
        if (!data?.rawDocument) return;
        try {
            const text = generateAtsPlainText(data.rawDocument);
            await navigator.clipboard.writeText(text);
            setCopiedAts(true);
            toast.success('ATS plain text copied to clipboard');
            setTimeout(() => setCopiedAts(false), 2000);
        } catch {
            toast.error('Failed to copy to clipboard');
        }
    };

    const handleTightenSpacing = () => {
        updateSettings({
            marginPreset: 'compact',
            lineHeight: 'tight',
        });
        toast.info('Set margins to compact and line-height to tight');
        setDismissSpillover(true);
    };

    const handleZoomIn = () => {
        setZoomMode('manual');
        setManualZoom((prev) =>
            Math.min(1.4, Math.round((prev + 0.1) * 10) / 10)
        );
    };

    const handleZoomOut = () => {
        setZoomMode('manual');
        setManualZoom((prev) =>
            Math.max(0.4, Math.round((prev - 0.1) * 10) / 10)
        );
    };

    const handleToggleFit = () => {
        if (zoomMode === 'fit') {
            setZoomMode('manual');
            setManualZoom(1);
        } else {
            setZoomMode('fit');
        }
    };

    return (
        <TooltipProvider delayDuration={200}>
            <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border-default bg-gunmetal">
                {/* Header Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-default px-3 py-2 bg-graphite">
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-ash">
                            Preview
                        </span>
                        {data && data.counts.items > 0 && (
                            <span className="hidden font-mono text-xs text-ash sm:inline">
                                {data.counts.sections} section
                                {data.counts.sections === 1 ? '' : 's'} ·{' '}
                                {data.counts.items} item
                                {data.counts.items === 1 ? '' : 's'}
                            </span>
                        )}
                        <span className="rounded-full bg-crucible px-2 py-0.5 font-mono text-[10px] font-medium text-ash border border-border-default">
                            {pageCount} {pageCount === 1 ? 'Page' : 'Pages'}
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        {/* Zoom Controls */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-ash hover:text-text-primary"
                                    onClick={handleZoomOut}
                                    aria-label="Zoom out"
                                >
                                    <ZoomOut className="h-3.5 w-3.5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Zoom out</TooltipContent>
                        </Tooltip>

                        <button
                            type="button"
                            onClick={handleToggleFit}
                            className="h-7 rounded px-1.5 font-mono text-[11px] text-ash hover:bg-crucible hover:text-text-primary transition-colors"
                            title="Toggle Fit / 100%"
                        >
                            {zoomMode === 'fit'
                                ? 'Fit'
                                : `${Math.round(activeScale * 100)}%`}
                        </button>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-ash hover:text-text-primary"
                                    onClick={handleZoomIn}
                                    aria-label="Zoom in"
                                >
                                    <ZoomIn className="h-3.5 w-3.5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Zoom in</TooltipContent>
                        </Tooltip>

                        <div className="mx-1 h-4 w-px bg-border-default" />

                        {/* Document Spacing & Layout Tuning */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-ash hover:text-text-primary"
                                    aria-label="Page tuning options"
                                    title="Page Spacing & Format"
                                >
                                    <SlidersHorizontal className="h-3.5 w-3.5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel className="text-[11px] font-medium uppercase tracking-wider text-ash">
                                    Paper Format
                                </DropdownMenuLabel>
                                <DropdownMenuItem
                                    onClick={() =>
                                        updateSettings({ paperFormat: 'a4' })
                                    }
                                    className={
                                        paperFormat === 'a4'
                                            ? 'text-flux font-semibold'
                                            : ''
                                    }
                                >
                                    A4 (ISO Standard)
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() =>
                                        updateSettings({
                                            paperFormat: 'letter',
                                        })
                                    }
                                    className={
                                        paperFormat === 'letter'
                                            ? 'text-flux font-semibold'
                                            : ''
                                    }
                                >
                                    US Letter
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuLabel className="text-[11px] font-medium uppercase tracking-wider text-ash">
                                    Page Margins
                                </DropdownMenuLabel>
                                <DropdownMenuItem
                                    onClick={() =>
                                        updateSettings({
                                            marginPreset: 'compact',
                                        })
                                    }
                                    className={
                                        data?.settings?.marginPreset ===
                                        'compact'
                                            ? 'text-flux font-semibold'
                                            : ''
                                    }
                                >
                                    Compact (0.5 in)
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() =>
                                        updateSettings({
                                            marginPreset: 'normal',
                                        })
                                    }
                                    className={
                                        !data?.settings?.marginPreset ||
                                        data?.settings?.marginPreset ===
                                            'normal'
                                            ? 'text-flux font-semibold'
                                            : ''
                                    }
                                >
                                    Normal (0.75 in)
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() =>
                                        updateSettings({
                                            marginPreset: 'spacious',
                                        })
                                    }
                                    className={
                                        data?.settings?.marginPreset ===
                                        'spacious'
                                            ? 'text-flux font-semibold'
                                            : ''
                                    }
                                >
                                    Spacious (1.0 in)
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuLabel className="text-[11px] font-medium uppercase tracking-wider text-ash">
                                    Line Spacing
                                </DropdownMenuLabel>
                                <DropdownMenuItem
                                    onClick={() =>
                                        updateSettings({ lineHeight: 'tight' })
                                    }
                                    className={
                                        data?.settings?.lineHeight === 'tight'
                                            ? 'text-flux font-semibold'
                                            : ''
                                    }
                                >
                                    Tight (Dense)
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() =>
                                        updateSettings({ lineHeight: 'normal' })
                                    }
                                    className={
                                        !data?.settings?.lineHeight ||
                                        data?.settings?.lineHeight === 'normal'
                                            ? 'text-flux font-semibold'
                                            : ''
                                    }
                                >
                                    Normal (Standard)
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() =>
                                        updateSettings({
                                            lineHeight: 'relaxed',
                                        })
                                    }
                                    className={
                                        data?.settings?.lineHeight === 'relaxed'
                                            ? 'text-flux font-semibold'
                                            : ''
                                    }
                                >
                                    Relaxed (Airy)
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Copy Plaintext ATS */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-ash hover:text-text-primary"
                                    onClick={handleCopyAts}
                                    aria-label="Copy ATS plain text"
                                >
                                    {copiedAts ? (
                                        <Check className="h-3.5 w-3.5 text-flux" />
                                    ) : (
                                        <Copy className="h-3.5 w-3.5" />
                                    )}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Copy ATS Plain Text</TooltipContent>
                        </Tooltip>
                    </div>
                </div>

                {/* Spillover Warning Banner */}
                {isSpillover && (
                    <div className="flex items-center justify-between gap-2 border-b border-flux/30 bg-flux/10 px-3 py-1.5 text-xs text-text-primary">
                        <div className="flex items-center gap-1.5">
                            <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-flux" />
                            <span>Trailing lines spilled onto Page 2.</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleTightenSpacing}
                                className="rounded bg-flux px-2 py-0.5 font-medium text-white hover:bg-flux-hover transition-colors"
                            >
                                Tighten to 1 Page
                            </button>
                            <button
                                type="button"
                                onClick={() => setDismissSpillover(true)}
                                className="text-ash hover:text-text-primary"
                                aria-label="Dismiss warning"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Scrollable Canvas */}
                <div
                    ref={canvasRef}
                    className="flex-1 overflow-y-auto bg-crucible/80 p-4 sm:p-6"
                >
                    {data && data.sections.length > 0 ? (
                        <div
                            className="mx-auto transition-transform duration-100"
                            style={{
                                width: pageWidth * activeScale,
                                minHeight: measuredHeight * activeScale,
                            }}
                        >
                            <div
                                style={{
                                    transform: `scale(${activeScale})`,
                                    transformOrigin: 'top left',
                                    width: pageWidth,
                                }}
                            >
                                <CvPreviewSheet
                                    data={data}
                                    pageHeight={pageHeight}
                                    onHeightMeasured={setMeasuredHeight}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="flex h-full min-h-[50vh] flex-col items-center justify-center gap-2 text-center">
                            <FileText className="h-10 w-10 text-ash/40" />
                            <p className="text-sm text-ash">
                                Add a section to see your CV take shape.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </TooltipProvider>
    );
}
