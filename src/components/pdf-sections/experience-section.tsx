'use client';

import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { pdfStyles } from '../../lib/pdf-styles/pdf-styles';

interface Props {
    content: Record<string, unknown>;
    billets: { id: string; content: Record<string, unknown> }[];
}

export const ExperienceSection = ({ content, billets }: Props) => {
    const company = String(content.companyName || '');
    const location = String(content.location || '');
    const startDate = String(content.startDate || '');
    const endDate = String(content.endDate || '');

    const dateString = startDate
        ? `${startDate} - ${endDate || 'Present'}`
        : '';

    console.log('Content: ', content);
    console.log('Billets: ', billets);
    return (
        // Section Header
        <View style={pdfStyles.sectionContainer}>
            {/* Company Description */}
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
                        ? `${bStart} - ${bEnd || 'Present'}`
                        : '';

                    return (
                        <View
                            key={billet.id}
                            style={[pdfStyles.bulletPoint, { marginTop: 2 }]}
                        >
                            <View style={pdfStyles.leftColumn}>
                                <Text style={pdfStyles.boldItalic}>
                                    {title}
                                </Text>
                                <Text style={pdfStyles.date}>{bDate}</Text>
                                :{' '}
                            </View>
                            {bDate && bDate !== dateString ? (
                                <View style={pdfStyles.leftColumn}>
                                    {desc ? (
                                        <View>
                                            <Text style={pdfStyles.description}>
                                                {desc}
                                            </Text>
                                        </View>
                                    ) : null}
                                </View>
                            ) : null}
                        </View>
                    );
                })}
            </View>
        </View>
    );
};
