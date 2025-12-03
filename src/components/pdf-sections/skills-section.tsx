'use client';

import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { pdfStyles } from '../../lib/pdf-styles/pdf-styles';

interface Props {
    content: Record<string, unknown>;
    billets: { id: string; content: Record<string, unknown> }[];
}

export const SkillsSection = ({ content }: Props) => {
    const name = String(content.skillName || '');
    const desc = String(content.skillDescription || '');
    const level = String(content.proficiencyLevel || '');

    return (
        <View style={pdfStyles.sectionContainer}>
            <View style={pdfStyles.bulletPoint}>
                <Text style={pdfStyles.bullet}>•</Text>
                <View style={pdfStyles.bulletContent}>
                    <Text style={pdfStyles.bold}>{name}</Text>
                    <Text>
                        {level ? ` (${level})` : ''}: {desc}
                    </Text>
                </View>
            </View>
        </View>
    );
};
