'use client';

import { useMemo } from 'react';
import { useCvDocumentStore } from '@/lib/store/use-cv-document';
import { SECTION_META, sectionAccent } from '@/lib/constants/cv-constants';
import { cvPreviewHelpers } from '@/lib/helpers/cv-preview';
import type { SectionType } from '@/lib/types/cv-document-types';
import { getCvFontOption } from '@/lib/pdf/font-options';

export interface PreviewSection {
    id: string;
    type: SectionType;
    title: string;
    defaultTitle: string;
    accent: string;
    itemCount: number;
    section: ReturnType<typeof cvPreviewHelpers.visibleSections>[number];
}

export interface PreviewData {
    title: string;
    sections: PreviewSection[];
    counts: { sections: number; items: number; subItems: number };
    fontFamily: ReturnType<typeof getCvFontOption>['id'];
}

export function useCvPreviewData(): PreviewData | null {
    const document = useCvDocumentStore((s) => s.document);

    return useMemo<PreviewData | null>(() => {
        if (!document) return null;

        const visible = cvPreviewHelpers.visibleSections(document);
        const sections: PreviewSection[] = visible.map((s) => ({
            id: s.id,
            type: s.type,
            title: s.title,
            defaultTitle: SECTION_META[s.type].defaultTitle,
            accent: sectionAccent[s.type],
            itemCount: s.items.length,
            section: s,
        }));

        return {
            title: document.title,
            sections,
            counts: cvPreviewHelpers.countItems(document),
            fontFamily: getCvFontOption(document.content.settings?.fontFamily)
                .id,
        };
    }, [document]);
}
