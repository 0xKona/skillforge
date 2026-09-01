import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { pdfStyles } from '@/lib/pdf/styles';
import type { DocumentSection } from '@/lib/types/cv-document-types';

interface Props {
    section: DocumentSection;
}

export function PdfSkills({ section }: Props) {
    return (
        <View>
            {section.items.map((item) => {
                const groupName = item.fields.groupName ?? '';
                const skills = item.subItems ?? [];

                const skillNames = skills
                    .map((s) => s.fields.skillName ?? '')
                    .filter(Boolean)
                    .join(', ');

                return (
                    <View key={item.id} style={pdfStyles.sectionContainer}>
                        <Text style={pdfStyles.itemTitle}>{groupName}</Text>
                        {skillNames && (
                            <Text style={pdfStyles.description}>
                                {skillNames}
                            </Text>
                        )}
                    </View>
                );
            })}
        </View>
    );
}
