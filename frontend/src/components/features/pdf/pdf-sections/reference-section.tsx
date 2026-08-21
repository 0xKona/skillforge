'use client';

import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { pdfStyles } from '../../../../lib/pdf-styles/pdf-styles';
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
                        <View style={pdfStyles.row}>
                            <View style={pdfStyles.leftColumn}>
                                <Text style={pdfStyles.bold}>
                                    {name}
                                    <Text style={pdfStyles.itemSubtitle}>
                                        {company ? `, ${company}` : ''}
                                    </Text>
                                </Text>
                            </View>
                            <View style={pdfStyles.rightColumn}>
                                {contact ? (
                                    <Text style={pdfStyles.description}>
                                        {contact}
                                    </Text>
                                ) : null}
                            </View>
                        </View>
                    </View>
                );
            })}
        </View>
    );
};
