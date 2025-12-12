'use client';

import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { pdfStyles } from '../../../lib/pdf-styles/pdf-styles';
import { Ingot } from '@/lib/types/ingot-types';
import { SortOrder } from '@/lib/types/sorting-types';
import IngotHelpers from '@/lib/classes/helper-ingot';

interface Props {
    ingots: Ingot[];
    ingotSortBy?: SortOrder;
}

export const CertificationSection = ({ ingots, ingotSortBy }: Props) => {
    const orderedIngots = IngotHelpers.sortIngots(ingots, ingotSortBy);

    return (
        <View>
            {orderedIngots.map((ingot) => {
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
