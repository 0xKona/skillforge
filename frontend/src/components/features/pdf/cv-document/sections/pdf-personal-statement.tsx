import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { pdfStyles } from '@/lib/pdf/styles';
import type { DocumentSection } from '@/lib/types/cv-document-types';

interface Props {
    section: DocumentSection;
}

export function PdfPersonalStatement({ section }: Props) {
    const item = section.items[0];
    if (!item) return null;

    const statement = item.fields.statement ?? '';

    return (
        <View style={pdfStyles.sectionContainer}>
            <Text style={pdfStyles.description}>{statement}</Text>
        </View>
    );
}
