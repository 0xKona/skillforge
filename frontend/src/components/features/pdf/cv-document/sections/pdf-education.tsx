import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { pdfStyles } from '@/lib/pdf/styles';
import type { DocumentSection } from '@/lib/types/cv-document-types';

interface Props {
    section: DocumentSection;
}

export function PdfEducation({ section }: Props) {
    return (
        <View>
            {section.items.map((item) => {
                const {
                    schoolName,
                    location,
                    startDate,
                    endDate,
                    qualificationLevel,
                } = item.fields;
                const dateString = startDate
                    ? `${startDate} - ${endDate || 'Present'}`
                    : '';

                const subItems = item.subItems ?? [];

                return (
                    <View key={item.id} style={pdfStyles.sectionContainer}>
                        <View style={pdfStyles.row}>
                            <View style={pdfStyles.leftColumn}>
                                <Text style={pdfStyles.itemTitle}>
                                    {schoolName}
                                    {qualificationLevel
                                        ? ` — ${qualificationLevel}`
                                        : ''}
                                </Text>
                            </View>
                            <View style={pdfStyles.rightColumn}>
                                <Text style={pdfStyles.date}>{dateString}</Text>
                            </View>
                        </View>
                        {location ? (
                            <Text style={pdfStyles.italic}>{location}</Text>
                        ) : null}
                        {subItems.length > 0 && (
                            <View style={{ marginTop: 2 }}>
                                {subItems.map((sub) => {
                                    const name = sub.fields.name ?? '';
                                    const grade = sub.fields.grade ?? '';
                                    return (
                                        <View
                                            key={sub.id}
                                            style={pdfStyles.bulletPoint}
                                        >
                                            <Text style={pdfStyles.bullet}>
                                                •
                                            </Text>
                                            <Text
                                                style={pdfStyles.bulletContent}
                                            >
                                                {name}
                                                {grade ? ` (${grade})` : ''}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>
                        )}
                    </View>
                );
            })}
        </View>
    );
}
