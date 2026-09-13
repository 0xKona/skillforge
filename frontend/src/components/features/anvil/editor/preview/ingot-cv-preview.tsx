'use client';

import { useMemo } from 'react';
import type {
    Billet,
    IngotEditorData,
    IngotType,
} from '@/lib/types/ingot-types';
import type {
    DocumentItem,
    DocumentSection,
} from '@/lib/types/cv-document-types';
import { SECTION_META } from '@/lib/constants/cv-constants';
import { cvImport } from '@/lib/helpers/cv-import';
import { sectionToLayout } from '@/lib/cv-layout';
import { LayoutPreview } from '@/components/features/forge/cv-document-preview/layout-preview';

interface IngotCvPreviewProps {
    ingotData: IngotEditorData;
    billets: Billet[];
}

export function IngotCvPreview({ ingotData, billets }: IngotCvPreviewProps) {
    const layout = useMemo(() => {
        if (!ingotData.type) return null;

        const sectionType = cvImport.toSectionType(ingotData.type as IngotType);
        const item: DocumentItem = {
            id: 'preview-item',
            fields: cvImport.extractFields(ingotData.content.fields),
            subItems:
                billets.length > 0
                    ? billets.map(cvImport.fromBillet)
                    : undefined,
        };

        const section: DocumentSection = {
            id: 'preview-section',
            type: sectionType,
            title: SECTION_META[sectionType]?.defaultTitle ?? ingotData.name,
            visible: true,
            items: [item],
        };

        return sectionToLayout(section);
    }, [ingotData, billets]);

    if (!layout || layout.nodes.length === 0) {
        return (
            <div className="flex min-h-[120px] items-center justify-center p-8 text-center text-sm text-ash bg-white font-sans">
                Fill in fields above to see live CV preview
            </div>
        );
    }

    return (
        <div className="bg-white font-sans p-8">
            <LayoutPreview layout={layout} />
        </div>
    );
}
