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

                // If there are billets (roles), render them as primary entries
                if (displayBillets.length > 0) {
                    return (
                        <View key={ingot.id}>
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
                                    : dateString; // Fallback to company date if billet date is missing

                                // Split description by newlines to create bullet points if needed
                                const descLines = desc
                                    .split('\n')
                                    .filter((line) => line.trim().length > 0);

                                return (
                                    <View
                                        key={billet.id}
                                        style={pdfStyles.sectionContainer}
                                    >
                                        <View style={pdfStyles.row}>
                                            <View style={pdfStyles.leftColumn}>
                                                <Text
                                                    style={pdfStyles.itemTitle}
                                                >
                                                    {title}, {company}
                                                </Text>
                                            </View>
                                            <View style={pdfStyles.rightColumn}>
                                                <Text style={pdfStyles.date}>
                                                    {bDate}
                                                </Text>
                                            </View>
                                        </View>

                                        {descLines.map((line, i) => (
                                            <View
                                                key={i}
                                                style={pdfStyles.bulletPoint}
                                            >
                                                <Text style={pdfStyles.bullet}>
                                                    •
                                                </Text>
                                                <Text
                                                    style={
                                                        pdfStyles.bulletContent
                                                    }
                                                >
                                                    {line.replace(
                                                        /^[•-]\s*/,
                                                        ''
                                                    )}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                );
                            })}
                        </View>
                    );
                }

                // Fallback: If no billets, render just the company info
                return (
                    <View key={ingot.id} style={pdfStyles.sectionContainer}>
                        <View style={pdfStyles.row}>
                            <View style={pdfStyles.leftColumn}>
                                <Text style={pdfStyles.itemTitle}>
                                    {company}
                                </Text>
                            </View>
                            <View style={pdfStyles.rightColumn}>
                                <Text style={pdfStyles.date}>{dateString}</Text>
                            </View>
                        </View>
                        {location ? (
                            <Text style={pdfStyles.italic}>{location}</Text>
                        ) : null}
                    </View>
                );
            })}
        </View>
    );
};
