'use client';

import { FileText } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useCvPreviewData } from '@/hooks/use-cv-preview-data';
import { CvPreviewSheet } from './cv-preview-sheet';

const A4_WIDTH = 794;
const A4_HEIGHT = 1123;
const PREVIEW_HEADER_HEIGHT = 33;
const CANVAS_VERTICAL_PADDING = 32;

export function CvPreviewPane() {
    const data = useCvPreviewData();
    const canvasRef = useRef<HTMLDivElement>(null);
    const [canvasWidth, setCanvasWidth] = useState(A4_WIDTH);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const updateWidth = () => setCanvasWidth(canvas.clientWidth);
        updateWidth();

        const observer = new ResizeObserver(updateWidth);
        observer.observe(canvas);
        return () => observer.disconnect();
    }, []);

    const scale = Math.min(1, Math.max(0, (canvasWidth - 32) / A4_WIDTH));
    const frameStyle = {
        width: A4_WIDTH * scale,
        height: A4_HEIGHT * scale,
    };
    const paneStyle = {
        height:
            PREVIEW_HEADER_HEIGHT + A4_HEIGHT * scale + CANVAS_VERTICAL_PADDING,
    };
    const sheetStyle = {
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
    };

    return (
        <div
            className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-border-default bg-gunmetal"
            style={paneStyle}
        >
            <div className="flex items-center justify-between border-b border-border-default px-3 py-2">
                <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-ash">
                        Preview
                    </span>
                    {data && data.counts.items > 0 && (
                        <span className="font-mono text-xs text-ash">
                            {data.counts.sections} section
                            {data.counts.sections === 1 ? '' : 's'} ·{' '}
                            {data.counts.items} item
                            {data.counts.items === 1 ? '' : 's'}
                        </span>
                    )}
                </div>
            </div>
            <div ref={canvasRef} className="overflow-hidden bg-graphite p-4">
                {data && data.sections.length > 0 ? (
                    <div className="mx-auto shrink-0" style={frameStyle}>
                        <div style={sheetStyle}>
                            <CvPreviewSheet data={data} />
                        </div>
                    </div>
                ) : (
                    <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-2 text-center">
                        <FileText className="h-10 w-10 text-ash/40" />
                        <p className="text-sm text-ash">
                            Add a section to see your CV take shape.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
