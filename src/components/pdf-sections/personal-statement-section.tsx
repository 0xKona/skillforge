'use client';

import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { pdfStyles } from '../../lib/pdf-styles/pdf-styles';

interface Props {
    content: Record<string, unknown>;
    billets: { id: string; content: Record<string, unknown> }[];
}

export const PersonalStatementSection = ({ content }: Props) => {
    const statement = String(content.statement || '');

    return (
        <View style={pdfStyles.sectionContainer}>
            <Text style={pdfStyles.description}>{statement}</Text>
        </View>
    );
};
