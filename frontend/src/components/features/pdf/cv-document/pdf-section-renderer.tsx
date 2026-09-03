import React from 'react';
import { pdfStyles } from '@/lib/pdf/styles';
import { sectionToLayout } from '@/lib/cv-layout';
import type { DocumentSection } from '@/lib/types/cv-document-types';

import { PdfLayout } from './pdf-layout';

interface PdfSectionRendererProps {
    section: DocumentSection;
    styles?: typeof pdfStyles;
}

export function PdfSectionRenderer({
    section,
    styles = pdfStyles,
}: PdfSectionRendererProps) {
    const layout = sectionToLayout(section);
    if (!layout) return null;

    return <PdfLayout layout={layout} styles={styles} />;
}
