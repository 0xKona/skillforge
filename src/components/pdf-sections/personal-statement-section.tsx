'use client';

import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { pdfStyles } from '../../lib/pdf-styles/pdf-styles';
import { Ingot } from '@/lib/types/ingot-types';

interface Props {
    ingot: Ingot;
}

export const PersonalStatementSection = ({ ingot }: Props) => {
    const { fields } = ingot.content;
    const statement = String(fields.statement?.value || '');

    return (
        <View style={pdfStyles.sectionContainer}>
            <Text style={pdfStyles.description}>{statement}</Text>
        </View>
    );
};
