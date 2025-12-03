'use client';

import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { pdfStyles } from '../../../lib/pdf-styles/pdf-styles';
import { PersonalInfoSection } from '../../pdf-sections/personal-info-section';
import { ExperienceSection } from '../../pdf-sections/experience-section';
import { EducationSection } from '../../pdf-sections/education-section';
import { SkillsSection } from '../../pdf-sections/skills-section';
import { CertificationsSection } from '../../pdf-sections/certifications-section';
import { ProjectsSection } from '../../pdf-sections/projects-section';
import { PersonalStatementSection } from '../../pdf-sections/personal-statement-section';
import { ReferenceSection } from '../../pdf-sections/reference-section';
import { GenericSection } from '../../pdf-sections/generic-section';

interface PreviewBillet {
    id: string;
    content: Record<string, unknown>;
}

interface IngotPDFProps {
    ingotName: string;
    ingotType: string;
    ingotContent: Record<string, unknown>;
    billets: PreviewBillet[];
}

export const IngotPDF = ({
    ingotType,
    ingotContent,
    billets,
}: IngotPDFProps) => {
    const getSectionTitle = () => {
        switch (ingotType) {
            case 'ingot_personal_info':
                return null;
            case 'ingot_experience':
                return 'Experience';
            case 'ingot_education':
                return 'Education';
            case 'ingot_skill':
                return 'Skills';
            case 'ingot_single_certification':
            case 'ingot_grouped_certification':
                return 'Certifications';
            case 'ingot_project':
                return 'Projects';
            case 'ingot_personal_statement':
                return String(ingotContent.title || 'Summary');
            case 'ingot_reference':
                return 'References';
            case 'ingot_hobby':
                return 'Hobbies';
            default:
                return ingotType
                    .replace('ingot_', '')
                    .replace(/_/g, ' ')
                    .toUpperCase();
        }
    };

    const renderSection = () => {
        switch (ingotType) {
            case 'ingot_personal_info':
                return (
                    <PersonalInfoSection
                        content={ingotContent}
                        billets={billets}
                    />
                );
            case 'ingot_experience':
                return (
                    <ExperienceSection
                        content={ingotContent}
                        billets={billets}
                    />
                );
            case 'ingot_education':
                return (
                    <EducationSection
                        content={ingotContent}
                        billets={billets}
                    />
                );
            case 'ingot_skill':
                return (
                    <SkillsSection content={ingotContent} billets={billets} />
                );
            case 'ingot_single_certification':
            case 'ingot_grouped_certification':
                return (
                    <CertificationsSection
                        type={ingotType}
                        content={ingotContent}
                        billets={billets}
                    />
                );
            case 'ingot_project':
                return (
                    <ProjectsSection content={ingotContent} billets={billets} />
                );
            case 'ingot_personal_statement':
                return (
                    <PersonalStatementSection
                        content={ingotContent}
                        billets={billets}
                    />
                );
            case 'ingot_reference':
                return (
                    <ReferenceSection
                        content={ingotContent}
                        billets={billets}
                    />
                );
            case 'ingot_hobby':
                return (
                    <GenericSection content={ingotContent} billets={billets} />
                );
            default:
                return (
                    <GenericSection content={ingotContent} billets={billets} />
                );
        }
    };

    const sectionTitle = getSectionTitle();

    return (
        <Document>
            <Page size="A4" style={pdfStyles.page}>
                <View>
                    {sectionTitle ? (
                        <Text style={pdfStyles.sectionTitle}>
                            {sectionTitle}
                        </Text>
                    ) : null}
                    {renderSection()}
                </View>
            </Page>
        </Document>
    );
};
