// -- CV Document Model --
// Self-contained document model for the CV editor.
// Items are stored inline (not as ingot ID references).
// Array order = display order. No sort preferences stored.

/**
 * Section types for the CV document.
 * Maps 1:1 with IngotType (minus the 'ingot_' prefix).
 */
export type SectionType =
    | 'personal_info'
    | 'personal_statement'
    | 'education'
    | 'experience'
    | 'project'
    | 'skill'
    | 'certification'
    | 'hobby'
    | 'reference';

import type { CvFontFamily } from '../pdf/font-options';

/**
 * A single entry within a section (e.g. one job, one qualification).
 * Fields are stored as flat key-value pairs — the schema defines what keys are valid.
 */
export interface DocumentItem {
    id: string;
    fields: Record<string, string>;
    subItems?: DocumentItem[];
    /** If this item was copied from the Anvil library, tracks the source. */
    sourceIngotId?: string;
}

/**
 * A section of the CV document (e.g. "Experience", "Education").
 * Contains items in display order.
 */
export interface DocumentSection {
    id: string;
    type: SectionType;
    title: string;
    visible: boolean;
    items: DocumentItem[];
}

/**
 * The content payload of a CV document.
 */
export interface DocumentContent {
    sections: DocumentSection[];
    settings?: {
        fontFamily?: CvFontFamily;
    };
}

/**
 * A complete CV document as stored in the database.
 */
export interface CvDocument {
    id: string;
    version: number;
    title: string;
    description?: string;
    content: DocumentContent;
    createdAt: string;
    updatedAt: string;
}

/**
 * Shape for creating a new CV document (before server assigns id/timestamps).
 */
export type NewCvDocument = Omit<CvDocument, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Field input types supported by the document schema.
 */
export type FieldInputType =
    'text' | 'textarea' | 'date' | 'email' | 'url' | 'tel' | 'select';

/**
 * Definition for a single field within a section schema.
 * Drives form generation, validation, and label display.
 */
export interface FieldDef {
    type: FieldInputType;
    required: boolean;
    label: string;
    placeholder?: string;
    options?: readonly string[];
}

/**
 * Schema for a section type — defines what fields items and sub-items have.
 */
export interface SectionSchema {
    fields: Record<string, FieldDef>;
    subFields?: Record<string, FieldDef>;
    maxItems?: number;
    allowSubItems: boolean;
}
