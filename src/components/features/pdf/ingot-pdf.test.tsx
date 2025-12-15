import { render, screen } from '@testing-library/react';
import { IngotPDF } from './ingot-pdf';
import { IngotEditorData } from '@/lib/types/ingot-types';

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

// Mock pdfStyles
jest.mock('@/lib/pdf-styles/pdf-styles', () => ({
    pdfStyles: {
        page: {},
    },
}));

describe('IngotPDF', () => {
    const mockIngotData: IngotEditorData = {
        id: '1',
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

    it('renders correctly', () => {
        render(<IngotPDF ingotData={mockIngotData} billetIds={[]} />);
        expect(screen.getByTestId('section-header')).toBeInTheDocument();
        expect(screen.getByTestId('section-renderer')).toBeInTheDocument();
    });

    it('passes custom title for personal statement', () => {
        const personalStatementIngot: IngotEditorData = {
            ...mockIngotData,
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

        render(<IngotPDF ingotData={personalStatementIngot} billetIds={[]} />);
        expect(screen.getByText('My Statement')).toBeInTheDocument();
    });
});
