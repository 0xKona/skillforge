import React from 'react';
import { Text } from '@react-pdf/renderer';
import { pdfStyles } from '../../lib/pdf-styles/pdf-styles';
import { IngotType } from '@/lib/types/ingot';

interface Props {
    ingotType: IngotType;
}

const SECTION_TITLES: Record<string, string> = {
    ingot_education: 'Education',
    ingot_experience: 'Experience',
    ingot_project: 'Projects',
    ingot_skill: 'Skills',
    ingot_single_certification: 'Certifications',
    ingot_personal_statement: 'Profile',
    ingot_hobby: 'Hobbies',
    ingot_reference: 'References',
};

export const SectionHeader = ({ ingotType }: Props) => {
    const title = SECTION_TITLES[ingotType];

    if (!title) return null;

    return <Text style={pdfStyles.sectionTitle}>{title}</Text>;
};
