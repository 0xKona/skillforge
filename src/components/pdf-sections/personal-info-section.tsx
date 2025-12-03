'use client';

import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { pdfStyles } from '../../lib/pdf-styles/pdf-styles';

interface Props {
    content: Record<string, unknown>;
    billets: { id: string; content: Record<string, unknown> }[];
}

export const PersonalInfoSection = ({ content, billets }: Props) => {
    const name = String(content.name || '');
    const email = String(content.email || '');
    const phone = String(content.phone || '');
    const address = String(content.address || '');

    const contactItems = [
        email,
        phone,
        address,
        ...billets.map((b) => {
            const platform = String(b.content.platform || '');
            const username = String(b.content.username || '');
            const url = String(b.content.url || '');

            if (url) {
                return `${platform}: ${url}`;
            }
            if (username) {
                return `${platform}: ${username}`;
            }

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
};
