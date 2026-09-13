import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QuickIngotDialog } from './quick-ingot-dialog';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ingotApi } from '@/lib/api/ingot';

jest.mock('@/lib/api/ingot');

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
});

describe('QuickIngotDialog', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders with initial values and submits new ingot', async () => {
        (ingotApi.createIngot as jest.Mock).mockResolvedValueOnce({
            id: 'new-ingot-1',
            name: 'Staff Engineer @ Stripe',
            type: 'ingot_experience',
            content: { fields: {}, billets: [] },
        });

        const handleCreated = jest.fn();

        render(
            <QueryClientProvider client={queryClient}>
                <QuickIngotDialog
                    open={true}
                    onOpenChange={jest.fn()}
                    sectionType="experience"
                    initialItem={{
                        id: 'item-1',
                        fields: {
                            companyName: 'Stripe',
                            role: 'Staff Engineer',
                        },
                        subItems: [
                            {
                                id: 'sub-1',
                                fields: {
                                    jobTitle: 'Staff Engineer',
                                    jobDescription:
                                        'Led global payment infrastructure',
                                },
                            },
                        ],
                    }}
                    onIngotCreated={handleCreated}
                />
            </QueryClientProvider>
        );

        expect(screen.getByText('Promote to Anvil Ingot')).toBeInTheDocument();

        const saveButton = screen.getByRole('button', {
            name: /save to library/i,
        });
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(ingotApi.createIngot).toHaveBeenCalled();
            expect(handleCreated).toHaveBeenCalledWith(
                expect.objectContaining({ id: 'new-ingot-1' })
            );
        });
    });
});
