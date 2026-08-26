import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { pdfStyles } from '@/lib/pdf/styles';
import type { DocumentSection } from '@/lib/types/cv-document-types';

interface Props {
    section: DocumentSection;
}

/**
 * Generic fallback renderer for simple section types (hobbies, references).
 * Renders each item's fields as key-value text.
 */
export function PdfGeneric({ section }: Props) {
    return (
        <View>
            {section.items.map((item) => {
                // Get all non-empty field values
                const values = Object.values(item.fields).filter(Boolean);
                const primary = values[0] ?? '';
                const secondary = values.slice(1).join(' · ');

                return (
                    <View key={item.id} style={pdfStyles.sectionContainer}>
                        <Text style={pdfStyles.itemTitle}>{primary}</Text>
                        {secondary ? (
                            <Text style={pdfStyles.description}>
                                {secondary}
                            </Text>
                        ) : null}
                    </View>
                );
            })}
        </View>
    );
}
