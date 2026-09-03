'use client';

import { useMemo } from 'react';
import { PreviewData } from '@/hooks/use-cv-preview-data';
import { previewStyles } from './styles';
import { getCvFontOption } from '@/lib/pdf/font-options';
import { sectionToLayout } from '@/lib/cv-layout';

import { LayoutPreview } from './layout-preview';

interface Props {
    data: PreviewData | null;
}

export function CvPreviewSheet({ data }: Props) {
    const sections = useMemo(() => data?.sections ?? [], [data]);

    if (!data) return null;

    return (
        <div className={previewStyles.sheet}>
            <div
                className={previewStyles.sheetInner}
                style={{
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
        </div>
    );
}
