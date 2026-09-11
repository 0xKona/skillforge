import { extractKeywords, analyzeJobMatch } from './job-tailoring';
import type { CvDocument } from '../types/cv-document-types';
import type { Ingot } from '../types/ingot-types';

describe('job-tailoring', () => {
    describe('extractKeywords', () => {
        it('extracts technical skills from text', () => {
            const text =
                'We need a Staff Engineer skilled in React, TypeScript, GraphQL, and Docker with AWS experience.';
            const result = extractKeywords(text);

            expect(result).toContain('react');
            expect(result).toContain('typescript');
            expect(result).toContain('graphql');
            expect(result).toContain('docker');
            expect(result).toContain('aws');
        });

        it('handles empty text', () => {
            expect(extractKeywords('')).toEqual([]);
        });
    });

    describe('analyzeJobMatch', () => {
        const mockDoc: CvDocument = {
            id: 'doc-1',
            version: 1,
            title: 'Frontend Engineer',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
            content: {
                sections: [
                    {
                        id: 's1',
                        type: 'experience',
                        title: 'Experience',
                        visible: true,
                        items: [
                            {
                                id: 'item-1',
                                fields: {
                                    company: 'Tech Co',
                                    description:
                                        'Built frontend applications using React and TypeScript.',
                                },
                            },
                        ],
                    },
                ],
            },
        };

        it('calculates matching score and segregates keywords', () => {
            const jd =
                'Looking for a developer with React, TypeScript, Kubernetes, and Terraform experience.';
            const result = analyzeJobMatch(jd, mockDoc);

            expect(result.matchedKeywords).toContain('react');
            expect(result.matchedKeywords).toContain('typescript');
            expect(result.missingKeywords).toContain('kubernetes');
            expect(result.missingKeywords).toContain('terraform');
            expect(result.score).toBe(50);
        });

        it('finds untapped Anvil ingots matching missing keywords', () => {
            const jd =
                'Looking for a developer with React, TypeScript, and Docker.';
            const anvilIngots: Ingot[] = [
                {
                    id: 'ingot-docker',
                    name: 'DevOps & Containerization',
                    type: 'ingot_experience',

                    content: {
                        fields: {
                            role: {
                                mandatory: false,
                                inputType: 'text',
                                value: 'Platform Lead',
                            },
                        },
                        billetFormat: null,
                        billets: [
                            {
                                id: 'b1',
                                type: 'role',
                                fields: {
                                    desc: {
                                        mandatory: false,
                                        inputType: 'textarea',
                                        value: 'Migrated 40 microservices to Docker containers.',
                                    },
                                },
                            },
                        ],
                    },
                    createdAt: '2024-01-01',
                    updatedAt: '2024-01-01',
                },
            ];

            const result = analyzeJobMatch(jd, mockDoc, anvilIngots);

            expect(result.anvilSuggestions.length).toBe(1);
            expect(result.anvilSuggestions[0].ingotTitle).toBe(
                'DevOps & Containerization'
            );
            expect(result.anvilSuggestions[0].matchedKeywords).toContain(
                'docker'
            );
        });
    });
});
