'use client';

import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { pdfStyles } from '../../lib/pdf-styles/pdf-styles';
import { Ingot } from '@/lib/types/ingot-types';

interface Props {
    ingots: Ingot[];
}

export const ReferenceSection = ({ ingots }: Props) => {
    return (
        <View>
            {ingots.map((ingot) => {
                const { fields } = ingot.content;
                const name = String(fields.referenceName?.value || '');
                const company = String(fields.referenceCompany?.value || '');
                const contact = String(fields.referenceContact?.value || '');

                return (
                    <View key={ingot.id} style={pdfStyles.sectionContainer}>
                        <Text style={pdfStyles.bold}>{name}</Text>
                        <Text>{company ? `, ${company}` : ''}</Text>
                        {contact ? (
                            <Text style={pdfStyles.description}>{contact}</Text>
                        ) : null}
                    </View>
                );
            })}
        </View>
    );
};
