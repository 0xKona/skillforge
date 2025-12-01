'use client'

import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { pdfStyles } from '../pdf-styles';
import { Billet } from '@/lib/types/ingot';

interface Props {
    content: Record<string, unknown>;
    billets: Billet[];
}

export const PersonalStatementSection = ({ content }: Props) => {
    const statement = String(content.statement || '');

    return (
        <View style={pdfStyles.sectionContainer}>
            <Text style={pdfStyles.description}>{statement}</Text>
        </View>
    );
};
