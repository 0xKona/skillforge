'use client'

import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { pdfStyles } from '../pdf-styles';
import { Billet } from '@/lib/types/ingot';

interface Props {
    type: string;
    content: Record<string, unknown>;
    billets: Billet[];
}

export const CertificationsSection = ({ type, content, billets }: Props) => {
    const isGrouped = type === 'ingot_grouped_certification';

    const name = String(content.certName || '');
    const desc = String(content.certDescription || '');
    const date = String(content.certDate || '');

    return (
        <View style={pdfStyles.sectionContainer}>
            {isGrouped ? (
                <View>
                    <Text style={pdfStyles.bold}>{name}</Text>
                    {desc ? (
                        <Text style={pdfStyles.description}>{desc}</Text>
                    ) : null}

                    <View style={{ marginTop: 4 }}>
                        {billets.map((billet) => {
                            const bName = String(billet.content.certName || '');
                            const bDesc = String(
                                billet.content.certDescription || ''
                            );
                            const bDate = String(
                                billet.content.dateAquired || ''
                            );

                            return (
                                <View
                                    key={billet.id}
                                    style={pdfStyles.bulletPoint}
                                >
                                    <Text style={pdfStyles.bullet}>•</Text>
                                    <View style={pdfStyles.bulletContent}>
                                        <Text style={pdfStyles.bold}>
                                            {bName}
                                        </Text>
                                        <Text>
                                            {bDate ? ` (${bDate})` : ''}
                                            {bDesc ? ` - ${bDesc}` : ''}
                                        </Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </View>
            ) : (
                <View>
                    <View style={pdfStyles.row}>
                        <View style={pdfStyles.leftColumn}>
                            <Text style={pdfStyles.bold}>{name}</Text>
                        </View>
                        <View style={pdfStyles.rightColumn}>
                            <Text style={pdfStyles.date}>{date}</Text>
                        </View>
                    </View>
                    {desc ? (
                        <Text style={pdfStyles.description}>{desc}</Text>
                    ) : null}
                </View>
            )}
        </View>
    );
};
