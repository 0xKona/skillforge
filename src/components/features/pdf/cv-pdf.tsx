import React from 'react';
import { Document, Page, View } from '@react-pdf/renderer';
import { pdfStyles } from '@/lib/pdf-styles/pdf-styles';
import { CV, Section } from '@/lib/types/cv-types';
import { Ingot, IngotType } from '@/lib/types/ingot-types';
import { SectionHeader } from '@/components/features/pdf/pdf-sections/section-header';
import SectionRenderer from './section-renderer';

interface CvPDFProps {
    cv: CV;
    availableIngots: Ingot[];
}

export const CvPDF = ({ cv, availableIngots }: CvPDFProps) => {
    const renderSectionContent = (section: Section) => {
        // Filter ingots for this section
        // We need to preserve the order defined in section.ingotIds
        // Also ensure uniqueness of IDs to prevent duplicates
        const uniqueIngotIds = Array.from(new Set(section.ingotIds));
        const sectionIngots = uniqueIngotIds
            .map((id) => availableIngots.find((ingot) => ingot.id === id))
            .filter((ingot): ingot is Ingot => !!ingot);

        if (sectionIngots.length === 0) return null;

        return (
            <SectionRenderer
                sectionType={section.sectionType}
                ingots={sectionIngots}
                billetIds={section.billetIds}
                billetSortBy={section.sortBilletsBy}
                ingotSortBy={section.sortIngotsBy}
            />
        );
    };

    return (
        <Document>
            <Page size="A4" style={pdfStyles.page}>
                {cv.cvContent.sections.map((section, index) => {
                    if (section.isVisible === false) return null;

                    const content = renderSectionContent(section);
                    if (!content) return null;

                    let customTitle;
                    if (
                        section.sectionType === 'ingot_personal_statement' &&
                        section.ingotIds.length > 0
                    ) {
                        const ingot = availableIngots.find(
                            (i) => i.id === section.ingotIds[0]
                        );
                        if (ingot) {
                            customTitle = ingot.content.fields.title?.value;
                        }
                    }

                    return (
                        <View
                            key={`${index}-${section.ingotIds.join('')}-${section.billetIds.join('')}`}
                            style={{ marginBottom: 10 }}
                        >
                            {section.sectionType !== 'ingot_personal_info' && (
                                <SectionHeader
                                    ingotType={section.sectionType as IngotType}
                                    customTitle={customTitle}
                                />
                            )}
                            {content}
                        </View>
                    );
                })}
            </Page>
        </Document>
    );
};
