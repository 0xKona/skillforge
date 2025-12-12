'use client';

import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { pdfStyles } from '../../../lib/pdf-styles/pdf-styles';
import { Ingot } from '@/lib/types/ingot-types';

interface Props {
    ingots: Ingot[];
}

export const GenericSection = ({ ingots }: Props) => {
    return (
        <View style={pdfStyles.sectionContainer}>
            {ingots.map((ingot) => {
                const { fields } = ingot.content;
                // Try to find common fields
                const name = String(
                    fields.name?.value ||
                        fields.hobbyName?.value ||
                        fields.title?.value ||
                        ''
                );
                const desc = String(
                    fields.description?.value ||
                        fields.hobbyDescription?.value ||
                        ''
                );

                return (
                    <View key={ingot.id} style={pdfStyles.bulletPoint}>
                        <Text style={pdfStyles.bullet}>•</Text>
                        <View style={pdfStyles.bulletContent}>
                            {name ? (
                                <Text style={pdfStyles.bold}>{name}</Text>
                            ) : null}
                            <Text>
                                {name && desc ? ': ' : ''}
                                {desc}
                            </Text>
                        </View>
                    </View>
                );
            })}
        </View>
    );
};
