export type CvFontFamily = 'inter' | 'helvetica' | 'times' | 'courier';

export interface CvFontOption {
    id: CvFontFamily;
    label: string;
    cssFamily: string;
    pdfFamily: string;
}

export const CV_FONT_OPTIONS: CvFontOption[] = [
    {
        id: 'inter',
        label: 'Inter',
        cssFamily: 'var(--font-inter), Arial, sans-serif',
        pdfFamily: 'Inter',
    },
    {
        id: 'helvetica',
        label: 'Helvetica',
        cssFamily: 'Arial, Helvetica, sans-serif',
        pdfFamily: 'Helvetica',
    },
    {
        id: 'times',
        label: 'Times New Roman',
        cssFamily: 'Georgia, "Times New Roman", serif',
        pdfFamily: 'Times-Roman',
    },
    {
        id: 'courier',
        label: 'Courier',
        cssFamily: '"Courier New", Courier, monospace',
        pdfFamily: 'Courier',
    },
];

export const DEFAULT_CV_FONT: CvFontFamily = 'inter';

export function getCvFontOption(fontFamily?: string): CvFontOption {
    return (
        CV_FONT_OPTIONS.find((option) => option.id === fontFamily) ??
        CV_FONT_OPTIONS[0]
    );
}
