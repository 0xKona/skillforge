import { render, screen, fireEvent } from '@testing-library/react';
import { JobTailorDrawer } from './job-tailor-drawer';
import { useCvDocumentStore } from '@/lib/store/use-cv-document';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

describe('JobTailorDrawer', () => {
    beforeEach(() => {
        useCvDocumentStore.getState().setDocument({
            id: 'doc-tailor-1',
            version: 1,
            title: 'Full Stack Engineer',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
            content: {
                sections: [
                    {
                        id: 's1',
                        type: 'experience',
                        title: 'Experience',
                        visible: true,
                        items: [
                            {
                                id: 'item-1',
                                fields: {
                                    role: 'Staff Engineer',
                                    description:
                                        'Architected microservices using React and TypeScript.',
                                },
                            },
                        ],
                    },
                ],
            },
        });
    });

    it('renders dialog and performs keyword matching when spec is entered', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <JobTailorDrawer open={true} onOpenChange={jest.fn()} />
            </QueryClientProvider>
        );

        expect(
            screen.getByText('The Quench: Job Spec Matcher')
        ).toBeInTheDocument();

        const loadSampleButton = screen.getByText('Load Sample Spec');
        fireEvent.click(loadSampleButton);

        expect(screen.getByText('Keyword Coverage')).toBeInTheDocument();
        expect(screen.getByText(/Covered in CV/i)).toBeInTheDocument();
    });
});
