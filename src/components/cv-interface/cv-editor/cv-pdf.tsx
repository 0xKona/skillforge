import React from 'react';
import { Document, Page, View } from '@react-pdf/renderer';
import { pdfStyles } from '@/lib/pdf-styles/pdf-styles';
import { CV, Section } from '@/lib/types/cv-types';
import { Ingot, IngotType } from '@/lib/types/ingot-types';
import { PersonalInfoSection } from '@/components/pdf-sections/personal-info-section';
import { ExperienceSection } from '@/components/pdf-sections/experience-section';
import { EducationSection } from '@/components/pdf-sections/education-section';
import { SkillsSection } from '@/components/pdf-sections/skills-section';
import { CertificationSection } from '@/components/pdf-sections/certifications-section';
import { ProjectsSection } from '@/components/pdf-sections/projects-section';
import { PersonalStatementSection } from '@/components/pdf-sections/personal-statement-section';
import { GenericSection } from '@/components/pdf-sections/generic-section';
import { ReferenceSection } from '@/components/pdf-sections/reference-section';
import { SectionHeader } from '@/components/pdf-sections/section-header';

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

        switch (section.sectionType) {
            case 'ingot_personal_info':
                // Personal Info usually only has one ingot
                return (
                    <PersonalInfoSection
                        ingot={sectionIngots[0]}
                        billetIds={section.billetIds}
                    />
                );

            case 'ingot_experience':
                return (
                    <ExperienceSection
                        ingots={sectionIngots}
                        billetIds={section.billetIds}
                        billetSortBy={section.sortBilletsBy}
                    />
                );

            case 'ingot_education':
                return (
                    <EducationSection
                        ingots={sectionIngots}
                        billetIds={section.billetIds}
                        billetSortBy={section.sortBilletsBy}
                    />
                );

            case 'ingot_skill':
                return (
                    <SkillsSection
                        ingots={sectionIngots}
                        billetIds={section.billetIds}
                    />
                );

            case 'ingot_certification':
                return (
                    <CertificationSection
                        ingots={sectionIngots}
                        ingotSortBy={section.sortIngotsBy}
                    />
                );

            case 'ingot_project':
                return <ProjectsSection ingots={sectionIngots} />;

            case 'ingot_personal_statement':
                return <PersonalStatementSection ingot={sectionIngots[0]} />;

            case 'ingot_reference':
                return <ReferenceSection ingots={sectionIngots} />;

            case 'ingot_hobby':
                return <GenericSection ingots={sectionIngots} />;

            default:
                return <GenericSection ingots={sectionIngots} />;
        }
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
