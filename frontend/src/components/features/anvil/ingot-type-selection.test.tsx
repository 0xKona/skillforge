import { render, screen } from '@testing-library/react';
import IngotTypeSelection from './ingot-type-selection';
import { IngotService } from '@/lib/classes/services/ingot-service';
import MappingHelpers from '@/lib/classes/helpers/mapping-helpers';
import { IngotType } from '@/lib/types/ingot-types';

// Mock dependencies
jest.mock('@/lib/classes/services/ingot-service');
jest.mock('@/lib/classes/helpers/mapping-helpers');

// Mock Next.js Link
jest.mock('next/link', () => ({
    __esModule: true,
    default: ({
        children,
        href,
    }: {
        children: React.ReactNode;
        href: string;
    }) => (
        <a href={href} data-testid="ingot-link">
            {children}
        </a>
    ),
}));

// Mock UI components
jest.mock('@/ui/shadcn/card', () => ({
    Card: ({
        children,
        className,
    }: {
        children: React.ReactNode;
        className: string;
    }) => (
        <div className={className} data-testid="card">
            {children}
        </div>
    ),
}));

jest.mock('@/ui/typography/typography', () => ({
    TypographyH2: ({
        children,
        className,
    }: {
        children: React.ReactNode;
        className: string;
    }) => <h2 className={className}>{children}</h2>,
    TypographyH3: ({
        children,
        className,
    }: {
        children: React.ReactNode;
        className: string;
    }) => <h3 className={className}>{children}</h3>,
    TypographyP: ({
        children,
        className,
    }: {
        children: React.ReactNode;
        className: string;
    }) => <p className={className}>{children}</p>,
}));

describe('IngotTypeSelection', () => {
    const mockIngotTypes: IngotType[] = ['ingot_experience', 'ingot_education'];

    beforeEach(() => {
        jest.clearAllMocks();

        // Setup default mocks
        (MappingHelpers.getIngotTypeList as jest.Mock).mockReturnValue(
            mockIngotTypes
        );
        (MappingHelpers.getIngotLabelByType as jest.Mock).mockImplementation(
            (type: string) => {
                if (type === 'ingot_experience') return 'Experience';
                if (type === 'ingot_education') return 'Education';
                return 'Unknown';
            }
        );
        (
            IngotService.getAnvilCardDisplayDetails as jest.Mock
        ).mockImplementation((type: string) => {
            return {
                color: 'bg-blue-500',
                icon: () => <span data-testid="icon">Icon</span>,
                label: type === 'ingot_experience' ? 'Work' : 'School',
            };
        });
    });

    it('renders the header correctly', () => {
        render(<IngotTypeSelection />);
        expect(screen.getByText('Select Ingot Type')).toBeInTheDocument();
    });

    it('renders a card for each ingot type', () => {
        render(<IngotTypeSelection />);
        const cards = screen.getAllByTestId('card');
        expect(cards).toHaveLength(2);
    });

    it('renders correct content for each card', () => {
        render(<IngotTypeSelection />);

        // Check Experience card content
        expect(screen.getByText('Experience')).toBeInTheDocument();
        expect(
            screen.getByText('Create a new experience entry.')
        ).toBeInTheDocument();
        expect(screen.getByText('Work')).toBeInTheDocument();

        // Check Education card content
        expect(screen.getByText('Education')).toBeInTheDocument();
        expect(
            screen.getByText('Create a new education entry.')
        ).toBeInTheDocument();
        expect(screen.getByText('School')).toBeInTheDocument();
    });

    it('renders correct links for each card', () => {
        render(<IngotTypeSelection />);
        const links = screen.getAllByTestId('ingot-link');

        expect(links[0]).toHaveAttribute(
            'href',
            '/anvil/create?ingotType=ingot_experience'
        );
        expect(links[1]).toHaveAttribute(
            'href',
            '/anvil/create?ingotType=ingot_education'
        );
    });

    it('renders icons correctly', () => {
        render(<IngotTypeSelection />);
        const icons = screen.getAllByTestId('icon');
        expect(icons).toHaveLength(2);
    });
});
