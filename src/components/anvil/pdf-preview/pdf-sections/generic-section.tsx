'use client'

import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { pdfStyles } from '../pdf-styles';
import { Billet } from '@/lib/types/ingot';

interface Props {
    content: Record<string, unknown>;
    billets: Billet[];
}

export const GenericSection = ({ content }: Props) => {
    // Try to find common fields
    const name = String(
        content.name || content.hobbyName || content.title || ''
    );
    const desc = String(content.description || content.hobbyDescription || '');

    return (
        <View style={pdfStyles.sectionContainer}>
            <View style={pdfStyles.bulletPoint}>
                <Text style={pdfStyles.bullet}>•</Text>
                <View style={pdfStyles.bulletContent}>
                    {name ? <Text style={pdfStyles.bold}>{name}</Text> : null}
                    <Text>
                        {name && desc ? ': ' : ''}
                        {desc}
                    </Text>
                </View>
            </View>
        </View>
    );
};
