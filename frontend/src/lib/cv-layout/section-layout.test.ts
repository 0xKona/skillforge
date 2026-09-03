import type {
    DocumentItem,
    DocumentSection,
    SectionType,
} from '@/lib/types/cv-document-types';

import { sectionToLayout } from './section-layout';
import type { LayoutBlock, LayoutNode } from './types';

function item(
    fields: Record<string, string>,
    subItems?: DocumentItem[]
): DocumentItem {
    return {
        id: crypto.randomUUID(),
        fields,
        subItems,
    };
}

function section(
    type: SectionType,
    items: DocumentItem[],
    title = 'Section'
): DocumentSection {
    return {
        id: crypto.randomUUID(),
        type,
        title,
        visible: true,
        items,
    };
}

function blocksOf(nodes: LayoutNode[]): LayoutBlock[] {
    return nodes.filter((n): n is LayoutBlock => n.type === 'block');
}

describe('sectionToLayout: empty', () => {
    it('returns null when a section has no printable content', () => {
        expect(sectionToLayout(section('hobby', []))).toBeNull();
        expect(
            sectionToLayout(section('hobby', [item({ hobbyName: '' })]))
        ).toBeNull();
        expect(
            sectionToLayout(
                section('personal_statement', [item({ statement: '' })])
            )
        ).toBeNull();
    });
});

describe('sectionToLayout: personal_info', () => {
    it('builds a header with linked contact items and omits empty platform prefixes', () => {
        const layout = sectionToLayout(
            section('personal_info', [
                item(
                    {
                        name: 'Ada Lovelace',
                        email: 'ada@example.com',
                        phone: '+44 7700 900000',
                        address: 'London, UK',
                    },
                    [
                        item({
                            platform: 'LinkedIn',
                            handle: '',
                            url: 'https://linkedin.com/in/ada',
                        }),
                        item({
                            platform: '',
                            handle: '',
                            url: 'https://github.com/ada',
                        }),
                    ]
                ),
            ])
        );

        expect(layout?.title).toBeNull();
        expect(layout?.nodes).toEqual([
            {
                type: 'header',
                name: 'Ada Lovelace',
                contacts: [
                    {
                        text: 'ada@example.com',
                        href: 'mailto:ada@example.com',
                    },
                    { text: '+44 7700 900000', href: 'tel:+447700900000' },
                    { text: 'London, UK' },
                    {
                        text: 'LinkedIn: https://linkedin.com/in/ada',
                        href: 'https://linkedin.com/in/ada',
                    },
                    {
                        text: 'https://github.com/ada',
                        href: 'https://github.com/ada',
                    },
                ],
            },
        ]);
    });
});

describe('sectionToLayout: personal_statement', () => {
    it('prints the statement and ignores the unused item title', () => {
        const layout = sectionToLayout(
            section(
                'personal_statement',
                [
                    item({
                        title: 'Should not appear',
                        statement: 'Engineer with a focus on compilers.',
                    }),
                ],
                'Personal Statement'
            )
        );

        expect(layout?.title).toBe('Personal Statement');
        expect(layout?.nodes).toEqual([
            {
                type: 'block',
                body: {
                    type: 'paragraph',
                    text: 'Engineer with a focus on compilers.',
                },
            },
        ]);
    });
});

describe('sectionToLayout: experience', () => {
    it('renders a single role as title, company/location subtitle, and description', () => {
        const layout = sectionToLayout(
            section('experience', [
                item(
                    {
                        companyName: 'Acme',
                        location: 'London',
                        startDate: '2020-01',
                        endDate: '2022-01',
                    },
                    [
                        item({
                            jobTitle: 'Developer',
                            jobDescription: 'Built the platform.',
                            startDate: '2021-01',
                            endDate: 'Present',
                        }),
                    ]
                ),
            ])
        );

        expect(blocksOf(layout!.nodes)).toEqual([
            {
                type: 'block',
                title: 'Developer',
                date: '2021-01 – Present',
                subtitle: { text: 'Acme, London' },
                body: {
                    type: 'paragraph',
                    text: 'Built the platform.',
                },
            },
        ]);
    });

    it('groups multiple roles under company and location', () => {
        const layout = sectionToLayout(
            section('experience', [
                item(
                    {
                        companyName: 'Acme',
                        location: 'London',
                        startDate: '2018-01',
                        endDate: '2024-01',
                    },
                    [
                        item({
                            jobTitle: 'Senior Developer',
                            jobDescription: 'Led the team.\nShipped v2.',
                            startDate: '2022-01',
                            endDate: 'Present',
                        }),
                        item({
                            jobTitle: 'Developer',
                            jobDescription: 'Wrote services.',
                            startDate: '2018-01',
                            endDate: '2021-12',
                        }),
                    ]
                ),
            ])
        );

        expect(layout?.nodes).toEqual([
            {
                type: 'group',
                heading: { title: 'Acme, London' },
                children: [
                    {
                        type: 'block',
                        title: 'Senior Developer',
                        date: '2022-01 – Present',
                        body: {
                            type: 'bullets',
                            items: ['Led the team.', 'Shipped v2.'],
                        },
                    },
                    {
                        type: 'block',
                        title: 'Developer',
                        date: '2018-01 – 2021-12',
                        body: {
                            type: 'paragraph',
                            text: 'Wrote services.',
                        },
                    },
                ],
            },
        ]);
    });

    it('falls back to company dates and still prints location when there are no roles', () => {
        const layout = sectionToLayout(
            section('experience', [
                item({
                    companyName: 'Acme',
                    location: 'London',
                    startDate: '2020-01',
                    endDate: '2021-01',
                }),
            ])
        );

        expect(blocksOf(layout!.nodes)[0]).toMatchObject({
            title: 'Acme',
            date: '2020-01 – 2021-01',
            subtitle: { text: 'London' },
        });
    });
});

describe('sectionToLayout: education', () => {
    it('puts qualification on the subtitle and prints subject, grade, and description', () => {
        const layout = sectionToLayout(
            section('education', [
                item(
                    {
                        schoolName: 'University of Manchester',
                        location: 'Manchester, UK',
                        startDate: '2018-09',
                        endDate: '2022-06',
                        qualificationLevel: "Bachelor's",
                    },
                    [
                        item({
                            name: 'Computer Science',
                            grade: 'First Class',
                            description: 'Compilers and distributed systems.',
                        }),
                    ]
                ),
            ])
        );

        expect(blocksOf(layout!.nodes)[0]).toEqual({
            type: 'block',
            title: 'University of Manchester, Manchester, UK',
            date: '2018-09 – 2022-06',
            subtitle: { text: "Bachelor's" },
            body: {
                type: 'bullets',
                items: [
                    'Computer Science (First Class)',
                    'Compilers and distributed systems.',
                ],
            },
        });
    });
});

describe('sectionToLayout: skill', () => {
    it('joins skills with details on a labeled line', () => {
        const layout = sectionToLayout(
            section('skill', [
                item({ groupName: 'Languages' }, [
                    item({
                        skillName: 'TypeScript',
                        description: '5 years',
                    }),
                    item({ skillName: 'Go', description: '' }),
                ]),
            ])
        );

        expect(layout?.nodes).toEqual([
            {
                type: 'labeledLine',
                label: 'Languages',
                value: 'TypeScript (5 years), Go',
            },
        ]);
    });
});

describe('sectionToLayout: project', () => {
    it('keeps a one-line description as a paragraph and links the URL', () => {
        const layout = sectionToLayout(
            section('project', [
                item({
                    projectTitle: 'Skillforge',
                    projectDescription: 'A CV builder.',
                    projectURL: 'https://example.com',
                }),
            ])
        );

        expect(blocksOf(layout!.nodes)[0]).toMatchObject({
            title: 'Skillforge',
            subtitle: {
                text: 'https://example.com',
                href: 'https://example.com',
            },
            body: { type: 'paragraph', text: 'A CV builder.' },
        });
    });
});

describe('sectionToLayout: certification, hobby, reference', () => {
    it('renders certifications with a date and paragraph', () => {
        const layout = sectionToLayout(
            section('certification', [
                item({
                    certName: 'AWS Solutions Architect',
                    certDate: '2024-03',
                    certDescription: 'Associate level.',
                }),
            ])
        );

        expect(blocksOf(layout!.nodes)[0]).toMatchObject({
            title: 'AWS Solutions Architect',
            date: '2024-03',
            body: { type: 'paragraph', text: 'Associate level.' },
        });
    });

    it('renders hobbies by name with a description paragraph', () => {
        const layout = sectionToLayout(
            section('hobby', [
                item({
                    hobbyName: 'Climbing',
                    hobbyDescription: 'Weekend trad routes.',
                }),
            ])
        );

        expect(blocksOf(layout!.nodes)[0]).toMatchObject({
            title: 'Climbing',
            body: { type: 'paragraph', text: 'Weekend trad routes.' },
        });
    });

    it('renders references as name, company, then contact', () => {
        const layout = sectionToLayout(
            section('reference', [
                item({
                    referenceName: 'Jane Doe',
                    referenceCompany: 'Acme',
                    referenceContact: 'jane@acme.com',
                }),
            ])
        );

        expect(blocksOf(layout!.nodes)[0]).toMatchObject({
            title: 'Jane Doe — Acme',
            body: { type: 'paragraph', text: 'jane@acme.com' },
        });
    });
});
