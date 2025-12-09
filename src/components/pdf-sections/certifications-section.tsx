'use client';

import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { pdfStyles } from '../../lib/pdf-styles/pdf-styles';
import { Ingot, SortOrder } from '@/lib/types/ingot';

interface Props {
    ingots: Ingot[];
    billetIds?: string[];
    sortBy?: SortOrder;
    billetSortBy?: SortOrder;
}

const getDateValue = (dateStr: string) => {
    if (!dateStr) return 0;
    return new Date(dateStr).getTime();
};

export const CertificationsSection = ({ ingots, sortBy }: Props) => {
    const displayIngots = [...ingots];

    if (sortBy === 'date-desc') {
        displayIngots.sort((a, b) => {
            const dateA = getDateValue(a.content.fields.certDate?.value || '');
            const dateB = getDateValue(b.content.fields.certDate?.value || '');
            return dateB - dateA;
        });
    } else if (sortBy === 'date-asc') {
        displayIngots.sort((a, b) => {
            const dateA = getDateValue(a.content.fields.certDate?.value || '');
            const dateB = getDateValue(b.content.fields.certDate?.value || '');
            return dateA - dateB;
        });
    }

    return (
        <View>
            {displayIngots.map((ingot) => {
                const { fields } = ingot.content;
                const name = String(fields.certName?.value || '');
                const desc = String(fields.certDescription?.value || '');
                const date = String(fields.certDate?.value || '');

                return (
                    <View key={ingot.id} style={pdfStyles.sectionContainer}>
                        <View style={pdfStyles.row}>
                            <View style={pdfStyles.leftColumn}>
                                <Text style={pdfStyles.bold}>{name}</Text>
                            </View>
                            <View style={pdfStyles.rightColumn}>
                                <Text style={pdfStyles.date}>{date}</Text>
                            </View>
                        </View>
                        {desc ? (
                            <Text style={pdfStyles.description}>{desc}</Text>
                        ) : null}
                    </View>
                );
            })}
        </View>
    );
};
