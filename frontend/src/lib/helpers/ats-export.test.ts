import { generateAtsPlainText } from './ats-export';
import type { CvDocument } from '../types/cv-document-types';

describe('generateAtsPlainText', () => {
    const mockDocument: CvDocument = {
        id: 'cv-ats-1',
        version: 1,
        title: 'Senior Engineer CV',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        content: {
            sections: [
                {
                    id: 'sec-1',
                    type: 'personal_info',
                    title: 'Personal Info',
                    visible: true,
                    items: [
                        {
                            id: 'item-1',
                            fields: {
                                name: 'Connor Robinson',
                                email: 'connor@example.com',
                                phone: '+44 7123 456789',
                                address: 'London, UK',
                            },
                        },
                    ],
                },
                {
                    id: 'sec-2',
                    type: 'experience',
                    title: 'Experience',
                    visible: true,
                    items: [
                        {
                            id: 'item-2',
                            fields: {
                                companyName: 'Acme Corp',
                                location: 'Remote',
                                startDate: '2022-01',
                                endDate: 'Present',
                            },
                            subItems: [
                                {
                                    id: 'sub-1',
                                    fields: {
                                        jobTitle: 'Senior Software Engineer',
                                        jobDescription:
                                            'Architected distributed event pipeline\nLed cross-functional team',
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    };

    it('generates clean, structured plaintext representation', () => {
        const result = generateAtsPlainText(mockDocument);

        expect(result).toContain('CONNOR ROBINSON');
        expect(result).toContain(
            'connor@example.com | +44 7123 456789 | London, UK'
        );
        expect(result).toContain('EXPERIENCE');
        expect(result).toContain('Acme Corp');
        expect(result).toContain('• Architected distributed event pipeline');
        expect(result).toContain('• Led cross-functional team');
    });

    it('handles empty documents gracefully', () => {
        const emptyDoc: CvDocument = {
            id: 'empty',
            version: 1,
            title: 'Empty',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
            content: { sections: [] },
        };
        expect(generateAtsPlainText(emptyDoc)).toBe('');
    });
});
