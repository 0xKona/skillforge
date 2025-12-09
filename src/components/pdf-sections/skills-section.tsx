'use client';

import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { pdfStyles } from '../../lib/pdf-styles/pdf-styles';
import { Ingot } from '@/lib/types/ingot-types';

interface Props {
    ingots: Ingot[];
}

export const SkillsSection = ({ ingots }: Props) => {
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
