import { IngotType } from './ingot-types';
import { SortOrder } from './preview-util-types';

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
    billetIds: string[]; // Billets to include (across all Ingots in this section)
    sortIngotsBy?: SortOrder; // Sort Ingots (e.g., by date)
    sortBilletsBy: SortOrder; // Sort billets within each Ingot
    customTitle?: string;
    isVisible?: boolean;
}
