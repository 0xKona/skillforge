import { IngotType } from './ingot';

export interface NewCV {
    version: number;
    title: string;
    description?: string | null;
    cvContent: CvContent;
}

export interface CV extends NewCV {
    id: string;
    createdAt: string;
    updatedAt: string;
}

export interface CvContent {
    sections: Section[];
}

export interface Section {
    sectionType: IngotType;
    ingotIds: string[]; // Ordered list of Ingot IDs
    includedBilletIds: string[]; // Billets to include (across all Ingots in this section)
    sortIngotsBy?: 'date-desc' | 'date-asc' | 'none'; // New: Sort Ingots (e.g., by date)
    sortBilletsBy: 'date-desc' | 'date-asc'; // Existing: Sort billets within each Ingot
}
