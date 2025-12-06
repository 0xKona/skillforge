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

export const ProjectsSection = ({ ingots }: Props) => {
    // Projects usually don't have dates in the current template, so no sorting by date.
    // Just render in order.

    return (
        <View>
            {ingots.map((ingot) => {
                const { fields } = ingot.content;
                const title = String(fields.projectTitle?.value || '');
                const desc = String(fields.projectDescription?.value || '');
                const url = String(fields.projectURL?.value || '');

                return (
                    <View key={ingot.id} style={pdfStyles.sectionContainer}>
                        <View style={pdfStyles.row}>
                            <View style={pdfStyles.leftColumn}>
                                <Text style={pdfStyles.bold}>{title}</Text>
                                <Text>{url ? ` | ${url}` : ''}</Text>
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
