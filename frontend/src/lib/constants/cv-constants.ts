import {
    Award,
    Brain,
    Briefcase,
    FileText,
    GraduationCap,
    Hammer,
    Headset,
    LucideIcon,
    User,
    Volleyball,
} from 'lucide-react';
import type { SectionSchema, SectionType } from '../types/cv-document-types';

// -- Section metadata --

export interface SectionMeta {
    type: SectionType;
    defaultTitle: string;
    singularLabel: string;
    icon: LucideIcon;
    maxSections: number;
    hasDates: boolean;
}

export const SECTION_META: Record<SectionType, SectionMeta> = {
    personal_info: {
        type: 'personal_info',
        defaultTitle: 'Personal Info',
        singularLabel: 'Personal Info',
        icon: User,
        maxSections: 1,
        hasDates: false,
    },
    personal_statement: {
        type: 'personal_statement',
        defaultTitle: 'Personal Statement',
        singularLabel: 'Personal Statement',
        icon: FileText,
        maxSections: 1,
        hasDates: false,
    },
    education: {
        type: 'education',
        defaultTitle: 'Education',
        singularLabel: 'Education Entry',
        icon: GraduationCap,
        maxSections: 1,
        hasDates: true,
    },
    experience: {
        type: 'experience',
        defaultTitle: 'Experience',
        singularLabel: 'Experience Entry',
        icon: Briefcase,
        maxSections: 1,
        hasDates: true,
    },
    project: {
        type: 'project',
        defaultTitle: 'Projects',
        singularLabel: 'Project',
        icon: Hammer,
        maxSections: 1,
        hasDates: false,
    },
    skill: {
        type: 'skill',
        defaultTitle: 'Skills',
        singularLabel: 'Skill Group',
        icon: Brain,
        maxSections: 1,
        hasDates: false,
    },
    certification: {
        type: 'certification',
        defaultTitle: 'Certifications',
        singularLabel: 'Certification',
        icon: Award,
        maxSections: 1,
        hasDates: true,
    },
    hobby: {
        type: 'hobby',
        defaultTitle: 'Hobbies',
        singularLabel: 'Hobby',
        icon: Volleyball,
        maxSections: 1,
        hasDates: false,
    },
    reference: {
        type: 'reference',
        defaultTitle: 'References',
        singularLabel: 'Reference',
        icon: Headset,
        maxSections: 1,
        hasDates: false,
    },
};

// -- Field schemas per section type --

const QUALIFICATION_LEVELS = [
    'GCSE',
    'A-Level',
    'Foundation',
    'HNC',
    'HND',
    "Bachelor's",
    "Master's",
    'PhD',
    'Diploma',
    'Certificate',
    'Other',
] as const;

export const SECTION_SCHEMAS: Record<SectionType, SectionSchema> = {
    personal_info: {
        fields: {
            name: {
                type: 'text',
                required: true,
                label: 'Full Name',
                placeholder: 'John Smith',
            },
            email: {
                type: 'email',
                required: false,
                label: 'Email',
                placeholder: 'john@example.com',
            },
            phone: {
                type: 'tel',
                required: false,
                label: 'Phone',
                placeholder: '+44 7700 900000',
            },
            address: {
                type: 'text',
                required: false,
                label: 'Address',
                placeholder: 'London, UK',
            },
        },
        subFields: {
            platform: {
                type: 'text',
                required: true,
                label: 'Platform',
                placeholder: 'LinkedIn',
            },
            username: {
                type: 'text',
                required: false,
                label: 'Username',
                placeholder: '@johnsmith',
            },
            url: {
                type: 'url',
                required: false,
                label: 'URL',
                placeholder: 'https://linkedin.com/in/johnsmith',
            },
        },
        maxItems: 1,
        allowSubItems: true,
    },
    personal_statement: {
        fields: {
            title: {
                type: 'text',
                required: true,
                label: 'Title',
                placeholder: 'Personal Statement',
            },
            statement: {
                type: 'textarea',
                required: true,
                label: 'Statement',
                placeholder: 'A brief summary of your professional profile...',
            },
        },
        maxItems: 1,
        allowSubItems: false,
    },
    education: {
        fields: {
            schoolName: {
                type: 'text',
                required: true,
                label: 'School / University',
                placeholder: 'University of Manchester',
            },
            location: {
                type: 'text',
                required: false,
                label: 'Location',
                placeholder: 'Manchester, UK',
            },
            startDate: {
                type: 'date',
                required: true,
                label: 'Start Date',
                placeholder: '2018-09',
            },
            endDate: {
                type: 'date',
                required: true,
                label: 'End Date',
                placeholder: '2022-06',
            },
            qualificationLevel: {
                type: 'select',
                required: false,
                label: 'Qualification Level',
                options: QUALIFICATION_LEVELS,
            },
        },
        subFields: {
            name: {
                type: 'text',
                required: true,
                label: 'Subject',
                placeholder: 'Computer Science',
            },
            description: {
                type: 'textarea',
                required: false,
                label: 'Description',
                placeholder: 'Key modules and achievements...',
            },
            grade: {
                type: 'text',
                required: false,
                label: 'Grade',
                placeholder: 'First Class',
            },
        },
        allowSubItems: true,
    },
    experience: {
        fields: {
            companyName: {
                type: 'text',
                required: true,
                label: 'Company',
                placeholder: 'Acme Corp',
            },
            location: {
                type: 'text',
                required: false,
                label: 'Location',
                placeholder: 'London, UK',
            },
            startDate: {
                type: 'date',
                required: true,
                label: 'Start Date',
                placeholder: '2022-01',
            },
            endDate: {
                type: 'date',
                required: true,
                label: 'End Date',
                placeholder: 'Present',
            },
        },
        subFields: {
            jobTitle: {
                type: 'text',
                required: true,
                label: 'Job Title',
                placeholder: 'Senior Developer',
            },
            jobDescription: {
                type: 'textarea',
                required: false,
                label: 'Description',
                placeholder: 'Key responsibilities and achievements...',
            },
            startDate: {
                type: 'date',
                required: true,
                label: 'Start Date',
                placeholder: '2023-01',
            },
            endDate: {
                type: 'date',
                required: true,
                label: 'End Date',
                placeholder: 'Present',
            },
        },
        allowSubItems: true,
    },
    project: {
        fields: {
            projectTitle: {
                type: 'text',
                required: true,
                label: 'Project Title',
                placeholder: 'My Open Source Project',
            },
            projectDescription: {
                type: 'textarea',
                required: true,
                label: 'Description',
                placeholder: 'What you built and why...',
            },
            projectURL: {
                type: 'url',
                required: false,
                label: 'URL',
                placeholder: 'https://github.com/user/project',
            },
        },
        allowSubItems: false,
    },
    skill: {
        fields: {
            groupName: {
                type: 'text',
                required: true,
                label: 'Group Name',
                placeholder: 'Programming Languages',
            },
        },
        subFields: {
            skillName: {
                type: 'text',
                required: true,
                label: 'Skill',
                placeholder: 'TypeScript',
            },
            description: {
                type: 'text',
                required: false,
                label: 'Detail',
                placeholder: '5 years experience',
            },
        },
        allowSubItems: true,
    },
    certification: {
        fields: {
            certName: {
                type: 'text',
                required: true,
                label: 'Certification Name',
                placeholder: 'AWS Solutions Architect',
            },
            certDate: {
                type: 'date',
                required: true,
                label: 'Date Acquired',
                placeholder: '2024-03',
            },
            certDescription: {
                type: 'textarea',
                required: false,
                label: 'Description',
                placeholder: 'Relevant details...',
            },
        },
        allowSubItems: false,
    },
    hobby: {
        fields: {
            hobbyName: {
                type: 'text',
                required: true,
                label: 'Hobby',
                placeholder: 'Rock Climbing',
            },
            hobbyDescription: {
                type: 'textarea',
                required: false,
                label: 'Description',
                placeholder: 'What it means to you...',
            },
        },
        allowSubItems: false,
    },
    reference: {
        fields: {
            referenceName: {
                type: 'text',
                required: true,
                label: 'Name',
                placeholder: 'Jane Doe',
            },
            referenceCompany: {
                type: 'text',
                required: true,
                label: 'Company',
                placeholder: 'Acme Corp',
            },
            referenceContact: {
                type: 'text',
                required: true,
                label: 'Contact',
                placeholder: 'jane.doe@acme.com',
            },
        },
        allowSubItems: false,
    },
};

// -- Utility: all section types as array --

export const ALL_SECTION_TYPES: SectionType[] = Object.keys(
    SECTION_META
) as SectionType[];
