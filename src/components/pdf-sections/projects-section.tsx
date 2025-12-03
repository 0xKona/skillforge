'use client';

import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { pdfStyles } from '../../lib/pdf-styles/pdf-styles';

interface Props {
    content: Record<string, unknown>;
    billets: { id: string; content: Record<string, unknown> }[];
}

export const ProjectsSection = ({ content }: Props) => {
    const title = String(content.projectTitle || '');
    const desc = String(content.projectDescription || '');
    const url = String(content.projectURL || '');

    return (
        <View style={pdfStyles.sectionContainer}>
            <View style={pdfStyles.row}>
                <View style={pdfStyles.leftColumn}>
                    <Text style={pdfStyles.bold}>{title}</Text>
                    <Text>{url ? ` | ${url}` : ''}</Text>
                </View>
            </View>

            {desc ? <Text style={pdfStyles.description}>{desc}</Text> : null}
        </View>
    );
};
