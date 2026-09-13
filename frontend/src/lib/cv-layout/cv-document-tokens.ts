import type {
    DocumentSettings,
    MarginPreset,
    LineHeightPreset,
    PaperFormat,
} from '@/lib/types/cv-document-types';

export interface DocumentDimensions {
    widthPt: number;
    heightPt: number;
    widthPx: number;
    heightPx: number;
}

export const PAPER_DIMENSIONS: Record<PaperFormat, DocumentDimensions> = {
    a4: {
        widthPt: 595.28,
        heightPt: 841.89,
        widthPx: 794,
        heightPx: 1123,
    },
    letter: {
        widthPt: 612,
        heightPt: 792,
        widthPx: 816,
        heightPx: 1056,
    },
};

export const PADDING_METRICS: Record<
    MarginPreset,
    { px: number; pt: number; tailwindClass: string }
> = {
    compact: { px: 28, pt: 21, tailwindClass: 'p-7' },
    normal: { px: 40, pt: 30, tailwindClass: 'p-10' },
    spacious: { px: 56, pt: 42, tailwindClass: 'p-14' },
};

export const LINE_HEIGHT_METRICS: Record<
    LineHeightPreset,
    { value: number; tailwindClass: string }
> = {
    tight: { value: 1.3, tailwindClass: 'leading-[1.3]' },
    normal: { value: 1.45, tailwindClass: 'leading-[1.45]' },
    relaxed: { value: 1.6, tailwindClass: 'leading-[1.6]' },
};

export const SPACING_TOKENS = {
    // Top-level sections
    sectionGapPt: 12, // 16px in CSS (mt-4)
    sectionGapPx: 16,

    // Blocks within a section
    blockGapPt: 12, // 16px in CSS (mb-4)
    blockGapPx: 16,

    // Section title
    sectionTitleBottomMarginPt: 6, // 8px in CSS (mb-2)
    sectionTitleBottomPaddingPt: 3, // 4px in CSS (pb-1)

    // Description text
    descriptionTopMarginPt: 3, // 4px in CSS (mt-1)

    // Nested group items (e.g. roles in experience)
    groupChildTopMarginPt: 6, // 8px in CSS (mt-2)

    // Bullets
    bulletIndentPt: 12, // 16px in CSS (pl-4)
    bulletWidthPt: 9, // dot width
    bulletGapPt: 6, // 8px in CSS (gap-2)

    // Header contact separator
    separatorMarginHorizontalPt: 3, // 4px in CSS (mx-1)
    separatorColor: '#666666', // text-black/60
} as const;

export interface CalibratedTokens {
    paperFormat: PaperFormat;
    dimensions: DocumentDimensions;
    paddingPt: number;
    paddingPx: number;
    lineHeight: number;
    marginClass: string;
    lineHeightClass: string;
    spacing: typeof SPACING_TOKENS;
}

export function getDocumentTokens(
    settings?: DocumentSettings
): CalibratedTokens {
    const paperFormat = settings?.paperFormat ?? 'a4';
    const marginPreset = settings?.marginPreset ?? 'normal';
    const lineHeightPreset = settings?.lineHeight ?? 'normal';

    const dimensions = PAPER_DIMENSIONS[paperFormat] ?? PAPER_DIMENSIONS.a4;
    const padding = PADDING_METRICS[marginPreset] ?? PADDING_METRICS.normal;
    const lineHeightInfo =
        LINE_HEIGHT_METRICS[lineHeightPreset] ?? LINE_HEIGHT_METRICS.normal;

    return {
        paperFormat,
        dimensions,
        paddingPt: padding.pt,
        paddingPx: padding.px,
        lineHeight: lineHeightInfo.value,
        marginClass: padding.tailwindClass,
        lineHeightClass: lineHeightInfo.tailwindClass,
        spacing: SPACING_TOKENS,
    };
}
