'use client';

import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { pdfStyles } from '../../lib/pdf-styles/pdf-styles';
import { Ingot, SortOrder } from '@/lib/types/ingot';

interface Props {
    ingots: Ingot[];
    billetIds?: string[];
    sortBy?: SortOrder;
    billetSortBy?: SortOrder;
}

export const SkillsSection = ({ ingots }: Props) => {
    // Skills usually don't have dates to sort by, but we could sort by name if needed.
    // For now, just render them in order.

    return (
        <View style={pdfStyles.sectionContainer}>
            {ingots.map((ingot) => {
                const { fields } = ingot.content;
                const name = String(fields.skillName?.value || '');
                const desc = String(fields.skillDescription?.value || '');
                const level = String(fields.proficiencyLevel?.value || '');

                return (
                    <View key={ingot.id} style={pdfStyles.bulletPoint}>
                        <Text style={pdfStyles.bullet}>•</Text>
                        <View style={pdfStyles.bulletContent}>
                            <Text style={pdfStyles.bold}>{name}</Text>
                            <Text>
                                {level ? ` (${level})` : ''}
                                {desc ? `: ${desc}` : ''}
                            </Text>
                        </View>
                    </View>
                );
            })}
        </View>
    );
};
