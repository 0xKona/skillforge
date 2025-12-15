import { render, screen, fireEvent } from '@testing-library/react';
import { BilletItem } from './billet-item';
import { Billet } from '@/lib/types/ingot-types';

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

jest.mock('@/ui/shadcn/alert-dialog', () => ({
    AlertDialog: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    AlertDialogTrigger: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    AlertDialogContent: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    AlertDialogHeader: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    AlertDialogTitle: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    AlertDialogDescription: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    AlertDialogFooter: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    AlertDialogCancel: ({ children }: { children: React.ReactNode }) => (
        <button>{children}</button>
    ),
    AlertDialogAction: ({
        children,
        onClick,
    }: {
        children: React.ReactNode;
        onClick: () => void;
    }) => <button onClick={onClick}>{children}</button>,
}));

describe('BilletItem', () => {
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();
    const mockBillet: Billet = {
        id: '1',
        type: 'billet_job',
        fields: {
            name: { value: 'Job Name', inputType: 'text', mandatory: false },
        },
    };

    it('renders billet info', () => {
        render(
            <BilletItem
                billet={mockBillet}
                isEditing={false}
                isDisabled={false}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        );
        expect(screen.getByText('Job Name')).toBeInTheDocument();
    });

    it('calls onEdit', () => {
        render(
            <BilletItem
                billet={mockBillet}
                isEditing={false}
                isDisabled={false}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        );
        // The edit button is the first button in the component structure
        const buttons = screen.getAllByRole('button');
        fireEvent.click(buttons[0]);
        expect(mockOnEdit).toHaveBeenCalledWith(mockBillet);
    });
});
