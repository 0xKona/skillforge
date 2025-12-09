'use client';

import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { pdfStyles } from '../../lib/pdf-styles/pdf-styles';
import { Ingot } from '@/lib/types/ingot-types';
import { SortOrder } from '@/lib/types/preview-util-types';

interface Props {
    ingot: Ingot;
    billetIds?: string[];
    billetSortBy?: SortOrder;
}

export const PersonalInfoSection = ({ ingot, billetIds }: Props) => {
    const {
        content: { fields, billets },
    } = ingot;

    const name = String(fields.name.value || '');
    const email = String(fields.email.value || '');
    const phone = String(fields.phone?.value || '');
    const address = String(fields.address?.value || '');

    // Filter billets
    let displayBillets = billets;
    if (billetIds) {
        displayBillets = billets.filter((b) => billetIds.includes(b.id));
    }

    const contactItems = [
        email,
        phone,
        address,
        ...displayBillets.map((b) => {
            const platform = String(b.fields.platform?.value || '');
            const username = String(b.fields.username?.value || '');
            const url = String(b.fields.url?.value || '');

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
