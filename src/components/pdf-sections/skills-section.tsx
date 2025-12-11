'use client';

import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { pdfStyles } from '../../lib/pdf-styles/pdf-styles';
import { Ingot } from '@/lib/types/ingot-types';
import { SortOrder } from '@/lib/types/preview-util-types';

interface Props {
    ingots: Ingot[];
    billetIds?: string[];
}

export const SkillsSection = ({ ingots, billetIds }: Props) => {
    return (
        <View style={pdfStyles.sectionContainer}>
            {ingots.map((ingot) => {
                const groupName = String(
                    ingot.content.fields.groupName?.value || ''
                );
                const billets = ingot.content.billets || [];

                // Filter billets if billetIds is provided
                const visibleBillets = billetIds
                    ? billets.filter((b) => billetIds.includes(b.id))
                    : billets;

                if (visibleBillets.length === 0) return null;

                return (
                    <View key={ingot.id} style={{ marginBottom: 4 }}>
                        {groupName && (
                            <Text
                                style={{
                                    ...pdfStyles.bold,
                                    marginBottom: 2,
                                    textDecoration: 'underline',
                                }}
                            >
                                {groupName}
                            </Text>
                        )}
                        {visibleBillets.map((billet) => {
                            const { fields } = billet;
                            const name = String(fields.skillName?.value || '');
                            const desc = String(
                                fields.description?.value || ''
                            );

                            return (
                                <View
                                    key={billet.id}
                                    style={pdfStyles.bulletPoint}
                                >
                                    <Text style={pdfStyles.bullet}>•</Text>
                                    <View style={pdfStyles.bulletContent}>
                                        <Text style={pdfStyles.bold}>
                                            {name}
                                        </Text>
                                        {desc ? <Text>: {desc}</Text> : null}
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                );
            })}
        </View>
    );
};
