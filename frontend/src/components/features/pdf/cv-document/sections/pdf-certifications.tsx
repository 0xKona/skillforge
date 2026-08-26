import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { pdfStyles } from '@/lib/pdf/styles';
import type { DocumentSection } from '@/lib/types/cv-document-types';

interface Props {
    section: DocumentSection;
}

export function PdfCertifications({ section }: Props) {
    return (
        <View>
            {section.items.map((item) => {
                const { certName, certDate, certDescription } = item.fields;

                return (
                    <View key={item.id} style={pdfStyles.sectionContainer}>
                        <View style={pdfStyles.row}>
                            <View style={pdfStyles.leftColumn}>
                                <Text style={pdfStyles.itemTitle}>
                                    {certName}
                                </Text>
                            </View>
                            <View style={pdfStyles.rightColumn}>
                                <Text style={pdfStyles.date}>{certDate}</Text>
                            </View>
                        </View>
                        {certDescription ? (
                            <Text style={pdfStyles.description}>
                                {certDescription}
                            </Text>
                        ) : null}
                    </View>
                );
            })}
        </View>
    );
}
