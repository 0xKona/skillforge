import { IngotType } from './ingot';

export interface CV_TEMPLATE_INTERFACE {
    version: number;
    displayName: string;
    description: string;
    cvContent: CvContent;
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
