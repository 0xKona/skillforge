'use client'

import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { pdfStyles } from '../pdf-styles';
import { Billet } from '@/lib/types/ingot';

interface Props {
    content: Record<string, unknown>;
    billets: Billet[];
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
