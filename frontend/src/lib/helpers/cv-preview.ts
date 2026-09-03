import type {
    CvDocument,
    DocumentItem,
    DocumentSection,
    NewCvDocument,
} from '../types/cv-document-types';

function safeFilename(title: string): string {
    const slug = title
        .trim()
        .replace(/[^a-z0-9-_]+/gi, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase();
    return slug || 'untitled-cv';
}

function countItems(document: CvDocument | NewCvDocument): {
    sections: number;
    items: number;
    subItems: number;
} {
    let items = 0;
    let subItems = 0;
    for (const section of document.content.sections) {
        if (!section.visible) continue;
        items += section.items.length;
        for (const item of section.items) {
            subItems += (item.subItems ?? []).length;
        }
    }
    return { sections: document.content.sections.length, items, subItems };
}

function visibleSections(
    document: CvDocument | NewCvDocument
): DocumentSection[] {
    return document.content.sections.filter((s) => s.visible);
}

function flattenItems(document: CvDocument | NewCvDocument): DocumentItem[] {
    const out: DocumentItem[] = [];
    for (const section of visibleSections(document)) {
        for (const item of section.items) {
            out.push(item);
        }
    }
    return out;
}

export const cvPreviewHelpers = {
    safeFilename,
    countItems,
    visibleSections,
    flattenItems,
};
