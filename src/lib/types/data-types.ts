export interface IngotField {
    mandatory: string; // "true" | "false"
    included: string; // "true" | "false"
    value: string;
}

export interface IngotTemplate {
    type: string;
    fields: Record<string, IngotField>;
    billets: unknown[]; // Placeholder for now
}

export interface BilletField {
    mandatory: string;
    included: string;
    value: string;
}

export interface BilletTemplate {
    type: string;
    fields: Record<string, BilletField>;
}

// Specific Ingot Content Interfaces (mapped from fields)
export interface EducationIngotContent {
    schoolName: string;
    location?: string;
    startDate: string;
    endDate: string;
    qualificationLevel?: string;
    gradeSummary?: string;
    billetTemplateType: string;
}

export interface ExperienceIngotContent {
    companyName: string;
    startDate: string;
    endDate: string;
    location?: string;
    billetTemplateType: string;
}

// Specific Billet Content Interfaces
export interface EduModuleBilletContent {
    name: string;
    description?: string;
    grade?: string;
}

export interface ExpJobBilletContent {
    startDate: string;
    endDate: string;
    jobTitle: string;
    jobDescription?: string;
}

// CV Structure Interface
export interface CvSection {
    name: string;
    ingotIds: string[];
}

export interface CvStructure {
    sections: CvSection[];
}
