import { render, screen } from '@testing-library/react';
import { CvPreview } from './cv-preview';

// Mock dynamic import of PDFViewer
jest.mock('next/dynamic', () => () => {
    const DynamicComponent = ({ children }: any) => (
        <div data-testid="pdf-viewer">{children}</div>
    );
    return DynamicComponent;
});

// Mock CvPDF
jest.mock('../../pdf/cv-pdf', () => ({
    CvPDF: () => <div data-testid="cv-pdf" />,
}));

describe('CvPreview', () => {
    const mockSections: any[] = [];
    const mockAvailableIngots: any[] = [];

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
