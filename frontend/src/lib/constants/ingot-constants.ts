/**
 * Display labels for ingot field keys.
 * Used by form rendering and PDF generation to show human-readable field names.
 */
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

/**
 * Qualification level options for education ingot fields.
 */
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
] as const;

/**
 * Skill proficiency level options for skill ingot fields.
 */
export const SKILL_PROFICIENCY_LEVELS = [
    'Beginner',
    'Intermediate',
    'Advanced',
    'Expert',
    'Master',
] as const;
