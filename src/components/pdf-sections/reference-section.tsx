'use client';

import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { pdfStyles } from '../../lib/pdf-styles/pdf-styles';

interface Props {
    content: Record<string, unknown>;
    billets: { id: string; content: Record<string, unknown> }[];
}

export const ReferenceSection = ({ content }: Props) => {
    const name = String(content.referenceName || '');
    const company = String(content.referenceCompany || '');
    const contact = String(content.referenceContact || '');

    return (
        <View style={pdfStyles.sectionContainer}>
            <Text style={pdfStyles.bold}>{name}</Text>
            <Text>{company ? `, ${company}` : ''}</Text>
            {contact ? (
                <Text style={pdfStyles.description}>{contact}</Text>
            ) : null}
        </View>
    );
};
