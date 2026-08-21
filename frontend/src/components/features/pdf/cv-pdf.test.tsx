import { render, screen } from '@testing-library/react';
import { CvPDF } from './cv-pdf';
import { CV, Section } from '@/lib/types/cv-types';
import { Ingot } from '@/lib/types/ingot-types';

// Mock react-pdf components
jest.mock('@react-pdf/renderer', () => ({
    Document: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    Page: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    View: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    Text: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    StyleSheet: { create: jest.fn() },
}));

// Mock pdfStyles
jest.mock('@/lib/pdf-styles/pdf-styles', () => ({
    pdfStyles: {
        page: {},
    },
}));

// Mock child components
jest.mock('@/components/features/pdf/pdf-sections/section-header', () => ({
    SectionHeader: ({ customTitle }: { customTitle?: string }) => (
        <div data-testid="section-header">{customTitle || 'Default Title'}</div>
    ),
}));

jest.mock('./section-renderer', () => {
    const MockSectionRenderer = () => <div data-testid="section-renderer" />;
    MockSectionRenderer.displayName = 'SectionRenderer';
    return MockSectionRenderer;
});

describe('CvPDF', () => {
    const mockIngot: Ingot = {
        id: 'ingot1',
        name: 'Test Ingot',
        type: 'ingot_experience',
        content: {
            fields: {},
            billets: [],
            billetFormat: null,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    const mockSection: Section = {
        sectionType: 'ingot_experience',
        ingotIds: ['ingot1'],
        billetIds: [],
        isVisible: true,
        sortBilletsBy: 'date-desc',
        sortIngotsBy: 'date-desc',
    };

    const mockCV: CV = {
        id: 'cv1',
        title: 'Test CV',
        version: 1,
        cvContent: {
            sections: [mockSection],
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    it('renders visible sections', () => {
        render(<CvPDF cv={mockCV} availableIngots={[mockIngot]} />);
        expect(screen.getByTestId('section-header')).toBeInTheDocument();
        expect(screen.getByTestId('section-renderer')).toBeInTheDocument();
    });

    it('does not render hidden sections', () => {
        const hiddenSectionCV: CV = {
            ...mockCV,
            cvContent: {
                sections: [{ ...mockSection, isVisible: false }],
            },
        };
        render(<CvPDF cv={hiddenSectionCV} availableIngots={[mockIngot]} />);
        expect(screen.queryByTestId('section-header')).not.toBeInTheDocument();
        expect(
            screen.queryByTestId('section-renderer')
        ).not.toBeInTheDocument();
    });

    it('does not render sections with no matching ingots', () => {
        render(<CvPDF cv={mockCV} availableIngots={[]} />);
        expect(screen.queryByTestId('section-header')).not.toBeInTheDocument();
        expect(
            screen.queryByTestId('section-renderer')
        ).not.toBeInTheDocument();
    });

    it('renders custom title for personal statement', () => {
        const personalStatementIngot: Ingot = {
            ...mockIngot,
            id: 'ps1',
            type: 'ingot_personal_statement',
            content: {
                fields: {
                    title: {
                        value: 'My Statement',
                        label: 'Title',
                        inputType: 'text',
                        mandatory: true,
                    },
                },
                billets: [],
                billetFormat: null,
            },
        };

        const personalStatementSection: Section = {
            ...mockSection,
            sectionType: 'ingot_personal_statement',
            ingotIds: ['ps1'],
        };

        const psCV: CV = {
            ...mockCV,
            cvContent: {
                sections: [personalStatementSection],
            },
        };

        render(<CvPDF cv={psCV} availableIngots={[personalStatementIngot]} />);
        expect(screen.getByText('My Statement')).toBeInTheDocument();
    });

    it('does not render header for personal info section', () => {
        const personalInfoIngot: Ingot = {
            ...mockIngot,
            id: 'pi1',
            type: 'ingot_personal_info',
        };

        const personalInfoSection: Section = {
            ...mockSection,
            sectionType: 'ingot_personal_info',
            ingotIds: ['pi1'],
        };

        const piCV: CV = {
            ...mockCV,
            cvContent: {
                sections: [personalInfoSection],
            },
        };

        render(<CvPDF cv={piCV} availableIngots={[personalInfoIngot]} />);
        expect(screen.queryByTestId('section-header')).not.toBeInTheDocument();
        expect(screen.getByTestId('section-renderer')).toBeInTheDocument();
    });
});
