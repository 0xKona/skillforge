// Plain-JS styles for the live HTML preview. Mirrors the typographic
// hierarchy of `lib/pdf/styles.ts` but expressed in CSS-friendly values.

export const previewStyles = {
    sheet: 'w-[794px] min-h-[1123px] bg-white text-black shadow-lg rounded-sm',
    sheetInner:
        'min-h-[1123px] p-10 font-sans text-[11pt] leading-[1.45] text-black',

    headerName:
        'text-center text-[24pt] font-bold uppercase tracking-[0.04em] text-black',
    headerContact:
        'mt-2 flex flex-wrap items-center justify-center gap-x-1 gap-y-1 text-[10pt] text-black',

    sectionTitle:
        'mb-2 border-b border-black pb-1 text-[11pt] font-bold uppercase tracking-[0.05em] text-black',

    sectionBlock: 'mb-4',
    row: 'flex items-start justify-between gap-3',
    itemTitle: 'text-[10.5pt] font-bold text-black',
    itemSubtitle: 'text-[10.5pt] italic text-black',
    date: 'shrink-0 text-[10.5pt] text-black',
    description: 'mt-1 text-justify text-[10.5pt] text-black',

    bullet: 'flex items-start gap-2 pl-4 text-[10.5pt] text-black',
    bulletDot: 'shrink-0 leading-[1.45]',
} as const;

export const marginPresetClasses = {
    compact: 'p-6 sm:p-7',
    normal: 'p-8 sm:p-10',
    spacious: 'p-12 sm:p-14',
} as const;

export const lineHeightClasses = {
    tight: 'leading-[1.3]',
    normal: 'leading-[1.45]',
    relaxed: 'leading-[1.6]',
} as const;
