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
    if (
        dateStr.toLowerCase() === 'present' ||
        dateStr.toLowerCase() === 'current'
    )
        return new Date().getTime();
    return new Date(dateStr).getTime();
};

export const EducationSection = ({ ingots, billetIds, sortBy }: Props) => {
    const displayIngots = [...ingots];

    if (sortBy === 'date-desc') {
        displayIngots.sort((a, b) => {
            const dateA = getDateValue(a.content.fields.startDate?.value || '');
            const dateB = getDateValue(b.content.fields.startDate?.value || '');
            return dateB - dateA;
        });
    } else if (sortBy === 'date-asc') {
        displayIngots.sort((a, b) => {
            const dateA = getDateValue(a.content.fields.startDate?.value || '');
            const dateB = getDateValue(b.content.fields.startDate?.value || '');
            return dateA - dateB;
        });
    }

    return (
        <View>
            {displayIngots.map((ingot) => {
                const { fields, billets } = ingot.content;
                const school = String(fields.schoolName?.value || '');
                const location = String(fields.location?.value || '');
                const startDate = String(fields.startDate?.value || '');
                const endDate = String(fields.endDate?.value || '');
                const qualification = String(
                    fields.qualificationLevel?.value || ''
                );

                const dateString = startDate
                    ? `${startDate} – ${endDate || 'Present'}`
                    : '';

                let displayBillets = billets;
                if (billetIds) {
                    displayBillets = billets.filter((b) =>
                        billetIds.includes(b.id)
                    );
                }

                return (
                    <View key={ingot.id} style={pdfStyles.sectionContainer}>
                        <View style={pdfStyles.row}>
                            <View style={pdfStyles.leftColumn}>
                                <Text style={pdfStyles.bold}>{school}</Text>
                                <Text style={pdfStyles.italic}>
                                    {qualification}
                                </Text>
                            </View>
                            <View style={pdfStyles.rightColumn}>
                                {location ? (
                                    <Text style={pdfStyles.date}>
                                        {location}
                                    </Text>
                                ) : null}
                                <Text style={pdfStyles.date}>{dateString}</Text>
                            </View>
                        </View>

                        {/* Subjects / Modules */}
                        {displayBillets.map((billet) => {
                            const name = String(
                                billet.fields.name?.value || ''
                            );
                            const desc = String(
                                billet.fields.description?.value || ''
                            );
                            const bGrade = String(
                                billet.fields.grade?.value || ''
                            );

                            return (
                                <View
                                    key={billet.id}
                                    style={[
                                        pdfStyles.bulletPoint,
                                        { marginTop: 2 },
                                    ]}
                                >
                                    <Text style={pdfStyles.bullet}>•</Text>
                                    <View style={pdfStyles.bulletContent}>
                                        <Text style={pdfStyles.bold}>
                                            {name}
                                            <Text style={pdfStyles.regular}>
                                                {bGrade ? `: ${bGrade}` : ''}
                                                {desc ? ` - ${desc}` : ''}
                                            </Text>
                                        </Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                );
            })}
        </View>
    );
};
