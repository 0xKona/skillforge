'use client';

import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { pdfStyles } from '../../lib/pdf-styles/pdf-styles';

interface Props {
    content: Record<string, unknown>;
    billets: { id: string; content: Record<string, unknown> }[];
}

export const EducationSection = ({ content, billets }: Props) => {
    const school = String(content.schoolName || '');
    const location = String(content.location || '');
    const startDate = String(content.startDate || '');
    const endDate = String(content.endDate || '');
    const qualification = String(content.qualificationLevel || '');

    const dateString = startDate
        ? `${startDate} – ${endDate || 'Present'}`
        : '';

    return (
        <View style={pdfStyles.sectionContainer}>
            <View style={pdfStyles.row}>
                <View style={pdfStyles.leftColumn}>
                    <Text style={pdfStyles.bold}>{school}</Text>
                    <Text style={pdfStyles.italic}>{qualification}</Text>
                </View>
                <View style={pdfStyles.rightColumn}>
                    {location ? (
                        <Text style={pdfStyles.date}>{location}</Text>
                    ) : null}
                    <Text style={pdfStyles.date}>{dateString}</Text>
                </View>
            </View>

            {/* Subjects / Modules */}
            {billets.map((billet) => {
                const name = String(billet.content.name || '');
                const desc = String(billet.content.description || '');
                const bGrade = String(billet.content.grade || '');

                return (
                    <View
                        key={billet.id}
                        style={[pdfStyles.bulletPoint, { marginTop: 2 }]}
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
};
