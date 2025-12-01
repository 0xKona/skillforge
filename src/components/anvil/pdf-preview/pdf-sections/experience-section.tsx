'use client'

import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { pdfStyles } from '../pdf-styles';
import { Billet } from '@/lib/types/ingot';

interface Props {
    content: Record<string, unknown>;
    billets: Billet[];
}

export const ExperienceSection = ({ content, billets }: Props) => {
    const company = String(content.companyName || '');
    const location = String(content.location || '');
    const startDate = String(content.startDate || '');
    const endDate = String(content.endDate || '');

    const dateString = startDate
        ? `${startDate} – ${endDate || 'Present'}`
        : '';

    return (
        <View style={pdfStyles.sectionContainer}>
            <View style={pdfStyles.row}>
                <View style={pdfStyles.leftColumn}>
                    <Text style={pdfStyles.bold}>{company}</Text>
                </View>
                <View style={pdfStyles.rightColumn}>
                    <Text style={pdfStyles.date}>{dateString}</Text>
                </View>
            </View>
            {location ? <Text style={pdfStyles.italic}>{location}</Text> : null}

            {/* Roles / Projects */}
            <View style={{ marginTop: 4 }}>
                {billets.map((billet) => {
                    const title = String(
                        billet.content.jobTitle ||
                            billet.content.projectName ||
                            ''
                    );
                    const desc = String(
                        billet.content.jobDescription ||
                            billet.content.projectDesc ||
                            ''
                    );
                    const bStart = String(billet.content.startDate || '');
                    const bEnd = String(billet.content.endDate || '');
                    const bDate = bStart
                        ? `${bStart} – ${bEnd || 'Present'}`
                        : '';

                    // If billet date differs significantly or if multiple roles, show date
                    // For simplicity, always show if present

                    return (
                        <View key={billet.id} style={{ marginBottom: 6 }}>
                            <View style={pdfStyles.row}>
                                <View style={pdfStyles.leftColumn}>
                                    <Text style={pdfStyles.boldItalic}>
                                        {title}
                                    </Text>
                                </View>
                                {bDate && bDate !== dateString ? (
                                    <View style={pdfStyles.rightColumn}>
                                        <Text style={pdfStyles.date}>
                                            {bDate}
                                        </Text>
                                    </View>
                                ) : null}
                            </View>

                            {desc ? (
                                <View style={{ marginTop: 2 }}>
                                    {/* Split by newlines for basic bullet points if user typed them, 
                                        or just text block. For now, text block. */}
                                    <Text style={pdfStyles.description}>
                                        {desc}
                                    </Text>
                                </View>
                            ) : null}
                        </View>
                    );
                })}
            </View>
        </View>
    );
};
