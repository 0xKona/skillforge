'use client';

import { useMemo, useRef, useEffect, useState } from 'react';
import { PreviewData } from '@/hooks/use-cv-preview-data';
import { previewStyles } from './styles';
import { getCvFontOption } from '@/lib/pdf/font-options';
import { sectionToLayout } from '@/lib/cv-layout';
import { getDocumentTokens } from '@/lib/cv-layout/cv-document-tokens';
import { LayoutPreview } from './layout-preview';
import { cn } from '@/lib/utils';

interface Props {
    data: PreviewData | null;
    pageHeight?: number;
    onHeightMeasured?: (height: number) => void;
}

export function CvPreviewSheet({
    data,
    pageHeight: overridePageHeight,
    onHeightMeasured,
}: Props) {
    const sections = useMemo(() => data?.sections ?? [], [data]);
    const innerRef = useRef<HTMLDivElement>(null);

    const tokens = useMemo(
        () => getDocumentTokens(data?.settings),
        [data?.settings]
    );
    const effectivePageHeight =
        overridePageHeight ?? tokens.dimensions.heightPx;

    const [sheetHeight, setSheetHeight] = useState(effectivePageHeight);

    useEffect(() => {
        const el = innerRef.current;
        if (!el) return;

        const updateHeight = () => {
            const h = el.offsetHeight;
            setSheetHeight(h);
            onHeightMeasured?.(h);
        };

        updateHeight();
        const observer = new ResizeObserver(updateHeight);
        observer.observe(el);
        return () => observer.disconnect();
    }, [onHeightMeasured, sections, data?.settings]);

    if (!data) return null;

    // Calculate how many page breaks to display
    const pageBreakCount = Math.max(
        0,
        Math.floor(sheetHeight / effectivePageHeight)
    );

    return (
        <div
            className={cn(
                previewStyles.sheet,
                'cv-preview-sheet relative transition-all'
            )}
            style={{
                width: `${tokens.dimensions.widthPx}px`,
                minHeight: `${tokens.dimensions.heightPx}px`,
            }}
        >
            <div
                ref={innerRef}
                className={cn(
                    'font-sans text-[11pt] text-black transition-all',
                    tokens.marginClass,
                    tokens.lineHeightClass
                )}
                style={{
                    minHeight: `${tokens.dimensions.heightPx}px`,
                    fontFamily: getCvFontOption(data.fontFamily).cssFamily,
                }}
            >
                {sections.length === 0 ? (
                    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
                        <p className="text-[12pt] font-medium text-black/70">
                            {data.title || 'Untitled CV'}
                        </p>
                        <p className="mt-2 text-[10pt] text-black/50">
                            Add your first section to see the preview.
                        </p>
                    </div>
                ) : (
                    sections.map((s) => {
                        const layout = sectionToLayout(s.section);
                        if (!layout) return null;
                        return <LayoutPreview key={s.id} layout={layout} />;
                    })
                )}
            </div>

            {/* Visual Page Break Guidelines (hidden during printing) */}
            {Array.from({ length: pageBreakCount }).map((_, i) => (
                <div
                    key={i}
                    className="no-print pointer-events-none absolute left-0 right-0 z-20 flex items-center justify-center"
                    style={{ top: `${(i + 1) * effectivePageHeight}px` }}
                >
                    <div className="w-full border-b-2 border-dashed border-flux/50" />
                    <span className="absolute rounded-full border border-flux/40 bg-graphite px-2.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-flux shadow-sm">
                        Page {i + 1} End / Page {i + 2} Start
                    </span>
                </div>
            ))}
        </div>
    );
}
