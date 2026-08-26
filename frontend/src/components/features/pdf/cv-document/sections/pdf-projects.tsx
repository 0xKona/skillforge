import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { pdfStyles } from '@/lib/pdf/styles';
import type { DocumentSection } from '@/lib/types/cv-document-types';

interface Props {
    section: DocumentSection;
}

export function PdfProjects({ section }: Props) {
    return (
        <View>
            {section.items.map((item) => {
                const { projectTitle, projectDescription, projectURL } =
                    item.fields;

                const descLines = (projectDescription ?? '')
                    .split('\n')
                    .filter((line) => line.trim().length > 0);

                return (
                    <View key={item.id} style={pdfStyles.sectionContainer}>
                        <Text style={pdfStyles.itemTitle}>{projectTitle}</Text>
                        {projectURL ? (
                            <Text style={pdfStyles.italic}>{projectURL}</Text>
                        ) : null}
                        {descLines.map((line, i) => (
                            <View key={i} style={pdfStyles.bulletPoint}>
                                <Text style={pdfStyles.bullet}>•</Text>
                                <Text style={pdfStyles.bulletContent}>
                                    {line.replace(/^[•-]\s*/, '')}
                                </Text>
                            </View>
                        ))}
                    </View>
                );
            })}
        </View>
    );
}
