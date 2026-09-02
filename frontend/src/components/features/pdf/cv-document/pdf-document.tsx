import React from 'react';
import { Document, Page, View } from '@react-pdf/renderer';
import { pdfStyles } from '@/lib/pdf/styles';
import { registerCvFonts } from '@/lib/pdf/fonts';
import type { CvDocument, NewCvDocument } from '@/lib/types/cv-document-types';

import { PdfSectionRenderer } from './pdf-section-renderer';

registerCvFonts();

interface PdfDocumentProps {
    document: CvDocument | NewCvDocument;
}

/**
 * Top-level PDF document component.
 * Receives a self-contained CvDocument and renders all visible sections.
 * No ingot fetching. No sorting. Items render in array order.
 */
export function PdfDocument({ document }: PdfDocumentProps) {
    const visibleSections = document.content.sections.filter((s) => s.visible);

    return (
        <Document>
            <Page size="A4" style={pdfStyles.page}>
                {visibleSections.map((section) => (
                    <View key={section.id} style={{ marginBottom: 10 }}>
                        <PdfSectionRenderer section={section} />
                    </View>
                ))}
            </Page>
        </Document>
    );
}
