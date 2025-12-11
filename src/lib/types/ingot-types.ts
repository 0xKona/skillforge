export interface IngotField {
    mandatory: boolean;
    value: string;
    inputType:
        | 'text'
        | 'date'
        | 'textarea'
        | 'select'
        | 'email'
        | 'tel'
        | 'url';
    label?: string;
    options?: string[];
}

export interface Billet {
    id: string;
    type: string;
    fields: Record<string, IngotField>;
}

export interface IngotContent {
    fields: Record<string, IngotField>;
    billetFormat: string | null;
    billets: Billet[];
}

export interface NewIngot {
    name: string;
    type: IngotType | '';
    content: IngotContent;
}

export interface Ingot extends NewIngot {
    id: string;
    createdAt: string;
    updatedAt: string;
}

export type IngotEditorData = NewIngot | Ingot;

export interface BilletTemplate {
    type: string;
    fields: Record<string, IngotField>;
}

export interface IngotTemplate {
    type: string;
    content: IngotContent;
}

export type IngotType =
    | 'ingot_education'
    | 'ingot_experience'
    | 'ingot_project'
    | 'ingot_skill'
    | 'ingot_single_certification'
    | 'ingot_personal_info'
    | 'ingot_personal_statement'
    | 'ingot_hobby'
    | 'ingot_reference';

export const QUALIFICATION_LEVELS = [
    'GCSE',
    'A-Level',
    'BTEC',
    "Bachelor's Degree",
    "Master's Degree",
    'PhD',
    'Certification',
    'Diploma',
    'Other',
];

export const SKILL_PROFICIENCY_LEVELS = [
    'Beginner',
    'Intermediate',
    'Advanced',
    'Expert',
    'Master',
];

export const INGOT_FIELD_LABELS: Record<string, string> = {
    // Common
    name: 'Name',
    description: 'Description',
    startDate: 'Start Date',
    endDate: 'End Date',
    location: 'Location',
    date: 'Date',
    url: 'URL',

    // Education
    schoolName: 'School Name',
    grade: 'Grade',
    qualificationLevel: 'Qualification Level',

    // Experience
    companyName: 'Company Name',
    jobTitle: 'Job Title',
    jobDescription: 'Job Description',

    // Certification
    certName: 'Certification Name',
    certDescription: 'Certification Description',
    dateAcquired: 'Date Acquired',
    issuer: 'Issuer',
    certDate: 'Certification Date',

    // Personal Info
    email: 'Email',
    phone: 'Phone',
    address: 'Address',

    // Social
    platform: 'Platform',
    username: 'Username',

    // Personal Statement
    title: 'Title',
    statement: 'Statement',

    // Skill
    skillName: 'Skill Name',
    skillDescription: 'Skill Description',
    proficiencyLevel: 'Proficiency Level',
    groupName: 'Group Name',

    // Project
    projectTitle: 'Project Title',
    projectDescription: 'Project Description',
    projectURL: 'Project URL',

    // Hobby
    hobbyName: 'Hobby Name',
    hobbyDescription: 'Hobby Description',

    // Reference
    referenceName: 'Reference Name',
    referenceCompany: 'Reference Company',
    referenceContact: 'Reference Contact',
};
