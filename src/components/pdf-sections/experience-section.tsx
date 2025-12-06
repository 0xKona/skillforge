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

export const ExperienceSection = ({
    ingots,
    billetIds,
    sortBy,
    billetSortBy,
}: Props) => {
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
                const company = String(fields.companyName?.value || '');
                const location = String(fields.location?.value || '');
                const startDate = String(fields.startDate?.value || '');
                const endDate = String(fields.endDate?.value || '');

                const dateString = startDate
                    ? `${startDate} - ${endDate || 'Present'}`
                    : '';

                let displayBillets = billets;
                if (billetIds) {
                    displayBillets = billets.filter((b) =>
                        billetIds.includes(b.id)
                    );
                }

                if (billetSortBy === 'date-desc') {
                    displayBillets.sort((a, b) => {
                        const dateA = getDateValue(
                            a.fields.startDate?.value || ''
                        );
                        const dateB = getDateValue(
                            b.fields.startDate?.value || ''
                        );
                        return dateB - dateA;
                    });
                } else if (billetSortBy === 'date-asc') {
                    displayBillets.sort((a, b) => {
                        const dateA = getDateValue(
                            a.fields.startDate?.value || ''
                        );
                        const dateB = getDateValue(
                            b.fields.startDate?.value || ''
                        );
                        return dateA - dateB;
                    });
                }

                return (
                    <View key={ingot.id} style={pdfStyles.sectionContainer}>
                        {/* Company Description */}
                        <View style={pdfStyles.row}>
                            <View style={pdfStyles.leftColumn}>
                                <Text style={pdfStyles.bold}>{company}</Text>
                            </View>
                            <View style={pdfStyles.rightColumn}>
                                <Text style={pdfStyles.date}>{dateString}</Text>
                            </View>
                        </View>
                        {location ? (
                            <Text style={pdfStyles.italic}>{location}</Text>
                        ) : null}

                        {/* Roles / Projects */}
                        <View style={{ marginTop: 4 }}>
                            {displayBillets.map((billet) => {
                                const title = String(
                                    billet.fields.jobTitle?.value || ''
                                );
                                const desc = String(
                                    billet.fields.jobDescription?.value || ''
                                );
                                const bStart = String(
                                    billet.fields.startDate?.value || ''
                                );
                                const bEnd = String(
                                    billet.fields.endDate?.value || ''
                                );
                                const bDate = bStart
                                    ? `${bStart} - ${bEnd || 'Present'}`
                                    : '';

                                return (
                                    <View
                                        key={billet.id}
                                        style={[
                                            pdfStyles.bulletPoint,
                                            { marginTop: 2 },
                                        ]}
                                    >
                                        <View style={pdfStyles.leftColumn}>
                                            <Text style={pdfStyles.boldItalic}>
                                                {title}
                                            </Text>
                                            {bDate && bDate !== dateString ? (
                                                <Text style={pdfStyles.date}>
                                                    {bDate}
                                                </Text>
                                            ) : null}
                                        </View>
                                        <View style={pdfStyles.leftColumn}>
                                            {desc ? (
                                                <View>
                                                    <Text
                                                        style={
                                                            pdfStyles.description
                                                        }
                                                    >
                                                        {desc}
                                                    </Text>
                                                </View>
                                            ) : null}
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                );
            })}
        </View>
    );
};
