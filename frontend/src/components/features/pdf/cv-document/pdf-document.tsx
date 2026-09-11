import React from 'react';
import { Document, Page, View } from '@react-pdf/renderer';
import { sectionToLayout } from '@/lib/cv-layout';
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
 * Calibrated 1:1 with CvPreviewSheet HTML preview.
 */
export function PdfDocument({ document }: PdfDocumentProps) {
    const visibleSections = document.content.sections.filter((s) => s.visible);
    const settings = document.content.settings;
    const styles = createPdfStyles(settings);

    const pageSize = settings?.paperFormat === 'letter' ? 'LETTER' : 'A4';

    return (
        <Document>
            <Page size={pageSize} style={styles.page}>
                {visibleSections.map((section, index) => {
                    const layout = sectionToLayout(section);
                    if (!layout) return null;
                    return (
                        <View
                            key={section.id}
                            style={
                                index === 0
                                    ? styles.sectionFirst
                                    : styles.section
                            }
                        >
                            <PdfLayout layout={layout} styles={styles} />
                        </View>
                    );
                })}
            </Page>
        </Document>
    );
}
