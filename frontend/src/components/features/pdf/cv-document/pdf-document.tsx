import React from 'react';
import { Document, Page, View } from '@react-pdf/renderer';
import { sectionToLayout } from '@/lib/cv-layout';
import { getCvFontOption } from '@/lib/pdf/font-options';
import { registerCvFonts } from '@/lib/pdf/fonts';
import { createPdfStyles } from '@/lib/pdf/styles';
import type { CvDocument, NewCvDocument } from '@/lib/types/cv-document-types';

import { PdfLayout } from './pdf-layout';

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
    const styles = createPdfStyles(
        getCvFontOption(document.content.settings?.fontFamily).pdfFamily
    );

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {visibleSections.map((section) => {
                    const layout = sectionToLayout(section);
                    if (!layout) return null;
                    return (
                        <View key={section.id} style={{ marginBottom: 10 }}>
                            <PdfLayout layout={layout} styles={styles} />
                        </View>
                    );
                })}
            </Page>
        </Document>
    );
}
