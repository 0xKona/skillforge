import { render, screen, fireEvent } from '@testing-library/react';
import LibraryCard from './library-card';
import { useCvInterfaceState } from '@/lib/store/use-cv-interface';
import { useAnvilInterfaceState } from '@/lib/store/use-anvil-interface';
import { IngotService } from '@/lib/classes/services/ingot-service';
import { Ingot } from '@/lib/types/ingot-types';
import { CV } from '@/lib/types/cv-types';
import { FileText } from 'lucide-react';

jest.mock('@/lib/store/use-cv-interface');
jest.mock('@/lib/store/use-anvil-interface');
jest.mock('@/lib/classes/services/ingot-service');

// Mock Shadcn components
jest.mock('@/ui/shadcn/card', () => ({
    Card: ({
        children,
        onClick,
        className,
    }: {
        children: React.ReactNode;
        onClick: () => void;
        className: string;
    }) => (
        <div onClick={onClick} className={className} data-testid="library-card">
            {children}
        </div>
    ),
}));

jest.mock('@/ui/shadcn/button', () => ({
    Button: ({
        children,
        onClick,
        className,
    }: {
        children: React.ReactNode;
        onClick: () => void;
        className: string;
    }) => (
        <button onClick={onClick} className={className}>
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
        onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    }) => <button onClick={onClick}>{children}</button>,
}));

describe('LibraryCard', () => {
    const mockOpenCv = jest.fn();
    const mockDeleteCv = jest.fn();
    const mockOpenAnvilIngot = jest.fn();
    const mockDeleteAnvilIngot = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useCvInterfaceState as unknown as jest.Mock).mockReturnValue({
            openCv: mockOpenCv,
            deleteCv: mockDeleteCv,
        });
        (useAnvilInterfaceState as unknown as jest.Mock).mockReturnValue({
            openAnvilIngot: mockOpenAnvilIngot,
            deleteAnvilIngot: mockDeleteAnvilIngot,
        });
    });

    it('renders CV card correctly', () => {
        const mockCv: CV = {
            id: 'cv-1',
            title: 'Test CV',
            description: 'CV Description',
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            version: 1,
            cvContent: { sections: [] },
        };

        render(<LibraryCard cardData={mockCv} />);

        expect(screen.getByText('Test CV')).toBeInTheDocument();
        expect(screen.getByText('CV Description')).toBeInTheDocument();
        expect(screen.getByText('CV')).toBeInTheDocument(); // Label
    });

    it('renders Ingot card correctly', () => {
        const mockIngot: Ingot = {
            id: 'ingot-1',
            name: 'Test Ingot',
            type: 'ingot_experience',
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            content: { billets: [], billetFormat: '', fields: {} },
        };

        (IngotService.getAnvilCardDisplayDetails as jest.Mock).mockReturnValue({
            color: 'bg-red-500',
            icon: FileText,
            label: 'Experience',
        });

        render(<LibraryCard cardData={mockIngot} />);

        expect(screen.getByText('Test Ingot')).toBeInTheDocument();
        expect(screen.getByText('Experience')).toBeInTheDocument();
    });

    it('handles card click', () => {
        const mockCv: CV = {
            id: 'cv-1',
            title: 'Test CV',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            version: 1,
            cvContent: { sections: [] },
        };
        render(<LibraryCard cardData={mockCv} />);

        fireEvent.click(screen.getByTestId('library-card'));
        expect(mockOpenCv).toHaveBeenCalledWith('cv-1');
    });

    it('handles delete action', () => {
        const mockCv: CV = {
            id: 'cv-1',
            title: 'Test CV',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            version: 1,
            cvContent: { sections: [] },
        };
        render(<LibraryCard cardData={mockCv} />);

        // Find delete button (in alert dialog trigger)
        const deleteButton = screen.getByText('Delete');
        fireEvent.click(deleteButton);

        expect(mockDeleteCv).toHaveBeenCalledWith('cv-1');
    });
});
