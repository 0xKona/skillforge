// -- Layout IDs --
// Each ingot card shares a layoutId that could be used for shared-element
// transitions if the component is extended in the future.

export const LAYOUT_IDS = {
    personalInfo: 'demo-ingot-personal-info',
    experience: 'demo-ingot-experience',
    skills: 'demo-ingot-skills',
} as const;

// -- Demo Ingot Data (Anvil view) --

export interface DemoIngot {
    id: string;
    layoutId: string;
    name: string;
    typeLabel: string;
    billetCount: number;
}

export const DEMO_INGOTS: DemoIngot[] = [
    {
        id: 'demo-ingot-1',
        layoutId: LAYOUT_IDS.personalInfo,
        name: 'Alex Johnson',
        typeLabel: 'Personal Info',
        billetCount: 1,
    },
    {
        id: 'demo-ingot-2',
        layoutId: LAYOUT_IDS.experience,
        name: 'Senior Engineer @ Acme · 2021–Present',
        typeLabel: 'Experience',
        billetCount: 3,
    },
    {
        id: 'demo-ingot-3',
        layoutId: LAYOUT_IDS.skills,
        name: 'Frontend Stack',
        typeLabel: 'Skills',
        billetCount: 4,
    },
];
