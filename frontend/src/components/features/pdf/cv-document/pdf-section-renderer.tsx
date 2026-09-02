import React from 'react';
import { Text } from '@react-pdf/renderer';
import { pdfStyles } from '@/lib/pdf/styles';
import type { DocumentSection } from '@/lib/types/cv-document-types';

import { PdfPersonalInfo } from './sections/pdf-personal-info';
import { PdfPersonalStatement } from './sections/pdf-personal-statement';
import { PdfExperience } from './sections/pdf-experience';
import { PdfEducation } from './sections/pdf-education';
import { PdfSkills } from './sections/pdf-skills';
import { PdfCertifications } from './sections/pdf-certifications';
import { PdfProjects } from './sections/pdf-projects';
import { PdfGeneric } from './sections/pdf-generic';

interface PdfSectionRendererProps {
    section: DocumentSection;
    styles?: typeof pdfStyles;
}

/**
 * Routes a DocumentSection to the correct PDF renderer.
 * Each renderer receives only the section — no external data needed.
 */
export function PdfSectionRenderer({
    section,
    styles = pdfStyles,
}: PdfSectionRendererProps) {
    if (section.items.length === 0) return null;

    return (
        <>
            {section.type !== 'personal_info' && (
                <Text style={styles.sectionTitle}>{section.title}</Text>
            )}
            <SectionContent section={section} />
        </>
    );
}

function SectionContent({ section }: { section: DocumentSection }) {
    switch (section.type) {
        case 'personal_info':
            return <PdfPersonalInfo section={section} />;
        case 'personal_statement':
            return <PdfPersonalStatement section={section} />;
        case 'experience':
            return <PdfExperience section={section} />;
        case 'education':
            return <PdfEducation section={section} />;
        case 'skill':
            return <PdfSkills section={section} />;
        case 'certification':
            return <PdfCertifications section={section} />;
        case 'project':
            return <PdfProjects section={section} />;
        case 'hobby':
        case 'reference':
        default:
            return <PdfGeneric section={section} />;
    }
}
