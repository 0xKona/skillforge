import React from 'react';
import { Ingot, IngotType } from '@/lib/types/ingot-types';
import { SortOrder } from '@/lib/types/sorting-types';
import { PersonalInfoSection } from '@/components/features/pdf/pdf-sections/personal-info-section';
import { ExperienceSection } from '@/components/features/pdf/pdf-sections/experience-section';
import { EducationSection } from '@/components/features/pdf/pdf-sections/education-section';
import { SkillsSection } from '@/components/features/pdf/pdf-sections/skills-section';
import { CertificationSection } from '@/components/features/pdf/pdf-sections/certifications-section';
import { ProjectsSection } from '@/components/features/pdf/pdf-sections/projects-section';
import { PersonalStatementSection } from '@/components/features/pdf/pdf-sections/personal-statement-section';
import { GenericSection } from '@/components/features/pdf/pdf-sections/generic-section';
import { ReferenceSection } from '@/components/features/pdf/pdf-sections/reference-section';

interface SectionRendererProps {
    sectionType: IngotType;
    ingots: Ingot[];
    billetIds?: string[];
    billetSortBy?: SortOrder;
    ingotSortBy?: SortOrder;
}

export default function SectionRenderer({
    sectionType,
    ingots,
    billetIds = [],
    billetSortBy = 'date-desc',
    ingotSortBy = 'date-desc',
}: SectionRendererProps) {
    if (ingots.length === 0) return null;

    switch (sectionType) {
        case 'ingot_personal_info':
            // Personal Info usually only has one ingot
            return (
                <PersonalInfoSection ingot={ingots[0]} billetIds={billetIds} />
            );

        case 'ingot_experience':
            return (
                <ExperienceSection
                    ingots={ingots}
                    billetIds={billetIds}
                    billetSortBy={billetSortBy}
                    ingotSortBy={ingotSortBy}
                />
            );

        case 'ingot_education':
            return (
                <EducationSection
                    ingots={ingots}
                    billetIds={billetIds}
                    ingotSortBy={ingotSortBy}
                />
            );

        case 'ingot_skill':
            return <SkillsSection ingots={ingots} billetIds={billetIds} />;

        case 'ingot_certification':
            return (
                <CertificationSection
                    ingots={ingots}
                    ingotSortBy={ingotSortBy}
                />
            );

        case 'ingot_project':
            return <ProjectsSection ingots={ingots} />;

        case 'ingot_personal_statement':
            return <PersonalStatementSection ingot={ingots[0]} />;

        case 'ingot_reference':
            return <ReferenceSection ingots={ingots} />;

        case 'ingot_hobby':
            return <GenericSection ingots={ingots} />;

        default:
            return <GenericSection ingots={ingots} />;
    }
}
