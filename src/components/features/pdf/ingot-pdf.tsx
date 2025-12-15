'use client';

import React from 'react';
import { Document, Page, View } from '@react-pdf/renderer';
import { Ingot, IngotEditorData, IngotType } from '@/lib/types/ingot-types';
import { SectionHeader } from '@/components/features/pdf/pdf-sections/section-header';
import { SortOrder } from '@/lib/types/sorting-types';
import { pdfStyles } from '@/lib/pdf-styles/pdf-styles';
import SectionRenderer from './section-renderer';

interface IngotPDFProps {
    ingotData: IngotEditorData;
    billetIds: string[];
    billetSortBy?: SortOrder;
}

export const IngotPDF = ({
    ingotData,
    billetIds,
    billetSortBy = 'date-desc',
}: IngotPDFProps) => {
    let customTitle;
    if (ingotData.type === 'ingot_personal_statement') {
        customTitle = ingotData.content.fields.title?.value;
    }

    return (
        <Document>
            <Page size="A4" style={pdfStyles.page}>
                <View>
                    <SectionHeader
                        ingotType={ingotData.type as IngotType}
                        customTitle={customTitle}
                    />
                    <SectionRenderer
                        sectionType={ingotData.type as IngotType}
                        ingots={[ingotData as Ingot]}
                        billetIds={billetIds}
                        billetSortBy={billetSortBy}
                    />
                </View>
            </Page>
        </Document>
    );
};
