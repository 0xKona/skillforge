import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { pdfStyles } from '@/lib/pdf/styles';
import type { DocumentSection } from '@/lib/types/cv-document-types';

interface Props {
    section: DocumentSection;
}

export function PdfExperience({ section }: Props) {
    return (
        <View>
            {section.items.map((item) => {
                const { companyName, location, startDate, endDate } =
                    item.fields;
                const dateString = startDate
                    ? `${startDate} - ${endDate || 'Present'}`
                    : '';

                const subItems = item.subItems ?? [];

                // If there are roles (sub-items), render them as primary entries
                if (subItems.length > 0) {
                    return (
                        <View key={item.id}>
                            {subItems.map((sub) => {
                                const title = sub.fields.jobTitle ?? '';
                                const desc = sub.fields.jobDescription ?? '';
                                const bStart = sub.fields.startDate ?? '';
                                const bEnd = sub.fields.endDate ?? '';
                                const bDate = bStart
                                    ? `${bStart} - ${bEnd || 'Present'}`
                                    : dateString;

                                const descLines = desc
                                    .split('\n')
                                    .filter((line) => line.trim().length > 0);

                                return (
                                    <View
                                        key={sub.id}
                                        style={pdfStyles.sectionContainer}
                                    >
                                        <View style={pdfStyles.row}>
                                            <View style={pdfStyles.leftColumn}>
                                                <Text
                                                    style={pdfStyles.itemTitle}
                                                >
                                                    {title}
                                                    {companyName
                                                        ? `, ${companyName}`
                                                        : ''}
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

                // Fallback: no roles, just show company
                return (
                    <View key={item.id} style={pdfStyles.sectionContainer}>
                        <View style={pdfStyles.row}>
                            <View style={pdfStyles.leftColumn}>
                                <Text style={pdfStyles.itemTitle}>
                                    {companyName}
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
}
