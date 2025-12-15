import { render, screen } from '@testing-library/react';
import { EditorHeader } from './editor-header';

jest.mock('@/ui/shadcn/button', () => ({
    Button: ({
        children,
        onClick,
        disabled,
    }: {
        children: React.ReactNode;
        onClick: () => void;
        disabled: boolean;
    }) => (
        <button onClick={onClick} disabled={disabled}>
            {children}
        </button>
    ),
}));
jest.mock('@/ui/shadcn/badge', () => ({
    Badge: ({ children }: { children: React.ReactNode }) => (
        <span>{children}</span>
    ),
}));
jest.mock('@/ui/typography/typography', () => ({
    TypographyH2: ({ children }: { children: React.ReactNode }) => (
        <h2>{children}</h2>
    ),
}));

describe('EditorHeader', () => {
    it('renders correctly', () => {
        render(
            <EditorHeader
                title="Test Title"
                typeLabel="Test Type"
                loading={false}
                onPreview={jest.fn()}
                onSave={jest.fn()}
            />
        );
        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Test Type')).toBeInTheDocument();
    });

    it('shows loading state', () => {
        render(
            <EditorHeader
                title="Test Title"
                loading={true}
                onPreview={jest.fn()}
                onSave={jest.fn()}
            />
        );
        expect(screen.getByText('Saving...')).toBeInTheDocument();
    });
});
