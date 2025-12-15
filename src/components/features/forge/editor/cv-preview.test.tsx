import { render, screen } from '@testing-library/react';
import { CvPreview } from './cv-preview';
import { Section } from '@/lib/types/cv-types';
import { Ingot } from '@/lib/types/ingot-types';
import { ReactNode } from 'react';

// Mock dynamic import of PDFViewer
jest.mock('next/dynamic', () => () => {
    const DynamicComponent = ({ children }: { children: ReactNode }) => (
        <div data-testid="pdf-viewer">{children}</div>
    );
    return DynamicComponent;
});

// Mock CvPDF
jest.mock('../../pdf/cv-pdf', () => ({
    CvPDF: () => <div data-testid="cv-pdf" />,
}));

describe('CvPreview', () => {
    const mockSections: Section[] = [];
    const mockAvailableIngots: Ingot[] = [];

    it('renders PDFViewer and CvPDF', () => {
        render(
            <CvPreview
                sections={mockSections}
                availableIngots={mockAvailableIngots}
            />
        );
        expect(screen.getByTestId('pdf-viewer')).toBeInTheDocument();
        expect(screen.getByTestId('cv-pdf')).toBeInTheDocument();
    });
});
