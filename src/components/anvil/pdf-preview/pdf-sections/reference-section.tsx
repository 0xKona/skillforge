'use client'

import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { pdfStyles } from '../pdf-styles';
import { Billet } from '@/lib/types/ingot';

interface Props {
    content: Record<string, unknown>;
    billets: Billet[];
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
