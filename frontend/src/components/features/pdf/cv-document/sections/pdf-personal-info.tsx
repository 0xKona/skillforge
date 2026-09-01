import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { pdfStyles } from '@/lib/pdf/styles';
import type { DocumentSection } from '@/lib/types/cv-document-types';

interface Props {
    section: DocumentSection;
}

export function PdfPersonalInfo({ section }: Props) {
    const item = section.items[0];
    if (!item) return null;

    const { name, email, phone, address } = item.fields;

    // Build contact items from fields + socials (sub-items)
    const contactItems = [
        email,
        phone,
        address,
        ...(item.subItems ?? []).map((sub) => {
            const platform = sub.fields.platform ?? '';
            const url = sub.fields.url ?? '';
            const username = sub.fields.username ?? '';
            if (url) return `${platform}: ${url}`;
            if (username) return `${platform}: ${username}`;
            return platform;
        }),
    ].filter(Boolean);

    return (
        <View style={pdfStyles.headerContainer}>
            <Text style={pdfStyles.headerName}>{name}</Text>
            <View style={pdfStyles.headerContact}>
                {contactItems.map((item, index) => (
                    <View key={index} style={{ flexDirection: 'row' }}>
                        <Text>{item}</Text>
                        {index < contactItems.length - 1 ? (
                            <Text style={pdfStyles.separator}>|</Text>
                        ) : null}
                    </View>
                ))}
            </View>
        </View>
    );
}
