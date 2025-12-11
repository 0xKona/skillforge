'use client';

import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { pdfStyles } from '../../lib/pdf-styles/pdf-styles';
import { Ingot } from '@/lib/types/ingot-types';

interface Props {
    ingots: Ingot[];
}

export const ProjectsSection = ({ ingots }: Props) => {
    return (
        <View>
            {ingots.map((ingot) => {
                const { fields } = ingot.content;
                const title = String(fields.projectTitle?.value || '');
                const desc = String(fields.projectDescription?.value || '');
                const url = String(fields.projectURL?.value || '');

                return (
                    <View key={ingot.id} style={pdfStyles.sectionContainer}>
                        <View style={pdfStyles.row}>
                            {/* Left Column */}
                            <View style={pdfStyles.leftColumn}>
                                <Text style={pdfStyles.bold}>{title}</Text>
                            </View>
                            {/* Right Column */}
                            <View style={pdfStyles.rightColumn}>
                                <Text>{url ? url : ''}</Text>
                            </View>
                        </View>

                        {desc ? (
                            <Text style={pdfStyles.description}>{desc}</Text>
                        ) : null}
                    </View>
                );
            })}
        </View>
    );
};
