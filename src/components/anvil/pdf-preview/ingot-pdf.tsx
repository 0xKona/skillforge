'use client';

import React from 'react';
import { Document, Page, View } from '@react-pdf/renderer';
import { pdfStyles } from '../../../lib/pdf-styles/pdf-styles';
import { PersonalInfoSection } from '../../pdf-sections/personal-info-section';
import { Ingot, IngotEditorData, IngotType } from '@/lib/types/ingot-types';
import { ExperienceSection } from '@/components/pdf-sections/experience-section';
import { EducationSection } from '@/components/pdf-sections/education-section';
import { SkillsSection } from '@/components/pdf-sections/skills-section';
import { CertificationSection } from '@/components/pdf-sections/certifications-section';
import { ProjectsSection } from '@/components/pdf-sections/projects-section';
import { PersonalStatementSection } from '@/components/pdf-sections/personal-statement-section';
import { GenericSection } from '@/components/pdf-sections/generic-section';
import { ReferenceSection } from '@/components/pdf-sections/reference-section';
import { SectionHeader } from '@/components/pdf-sections/section-header';
import { SortOrder } from '@/lib/types/preview-util-types';

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
    function renderSection() {
        switch (ingotData.type) {
            case 'ingot_personal_info':
                return (
                    <PersonalInfoSection
                        ingot={ingotData as Ingot}
                        billetIds={billetIds}
                    />
                );
            case 'ingot_experience':
                return (
                    <ExperienceSection
                        ingots={[ingotData as Ingot]}
                        billetIds={billetIds}
                        billetSortBy={billetSortBy}
                    />
                );
            case 'ingot_education':
                return (
                    <EducationSection
                        ingots={[ingotData as Ingot]}
                        billetIds={billetIds}
                        billetSortBy={billetSortBy}
                    />
                );
            case 'ingot_skill':
                return (
                    <SkillsSection
                        ingots={[ingotData as Ingot]}
                        billetIds={billetIds}
                    />
                );
            case 'ingot_certification':
                return (
                    <CertificationSection
                        ingots={[ingotData as Ingot]}
                        ingotSortBy={billetSortBy}
                    />
                );
            case 'ingot_project':
                return <ProjectsSection ingots={[ingotData as Ingot]} />;
            case 'ingot_personal_statement':
                return <PersonalStatementSection ingot={ingotData as Ingot} />;
            case 'ingot_reference':
                return <ReferenceSection ingots={[ingotData as Ingot]} />;
            case 'ingot_hobby':
                return <GenericSection ingots={[ingotData as Ingot]} />;
            default:
                return <GenericSection ingots={[ingotData as Ingot]} />;
        }
    }

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
                    {renderSection()}
                </View>
            </Page>
        </Document>
    );
};
