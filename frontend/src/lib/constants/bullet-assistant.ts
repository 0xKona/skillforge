export interface VerbCategory {
    label: string;
    verbs: string[];
}

export const ACTION_VERB_CATEGORIES: VerbCategory[] = [
    {
        label: 'Engineering & Tech',
        verbs: [
            'Architected',
            'Engineered',
            'Overhauled',
            'Refactored',
            'Automated',
            'Deployed',
            'Standardized',
        ],
    },
    {
        label: 'Leadership & Strategy',
        verbs: [
            'Spearheaded',
            'Orchestrated',
            'Championed',
            'Directed',
            'Mentored',
            'Mobilized',
            'Steered',
        ],
    },
    {
        label: 'Optimization & Efficiency',
        verbs: [
            'Accelerated',
            'Reduced',
            'Consolidated',
            'Eliminated',
            'Optimized',
            'Scaled',
            'Streamlined',
        ],
    },
];

export const WEAK_PHRASES = [
    {
        weak: 'responsible for',
        suggestion: 'Spearheaded / Managed / Delivered',
    },
    {
        weak: 'helped with',
        suggestion: 'Co-engineered / Collaborated to deliver',
    },
    { weak: 'worked on', suggestion: 'Architected / Developed / Implemented' },
    { weak: 'assisted', suggestion: 'Facilitated / Partnered / Supported' },
];
