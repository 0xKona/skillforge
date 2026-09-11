import { render, screen, fireEvent } from '@testing-library/react';
import { AddFromLibrarySheet } from './add-from-library-sheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ingotApi } from '@/lib/api/ingot';
import { useCvDocumentStore } from '@/lib/store/use-cv-document';

jest.mock('@/lib/api/ingot');

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
});

describe('AddFromLibrarySheet', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useCvDocumentStore.getState().setDocument({
            id: 'doc-1',
            version: 1,
            title: 'My CV',
            createdAt: '',
            updatedAt: '',
            content: {
                sections: [
                    {
                        id: 's1',
                        type: 'experience',
                        title: 'Experience',
                        visible: true,
                        items: [],
                    },
                ],
            },
        });
    });

    it('renders master-detail workbench, allows selecting billets and imports to CV', async () => {
        (ingotApi.getAllIngots as jest.Mock).mockResolvedValueOnce([
            {
                id: 'ingot-google',
                name: 'Google Experience',
                type: 'ingot_experience',
                content: {
                    fields: {
                        companyName: {
                            mandatory: true,
                            value: 'Google',
                            inputType: 'text',
                        },
                    },
                    billetFormat: null,
                    billets: [
                        {
                            id: 'billet-k8s',
                            type: 'job',
                            fields: {
                                jobTitle: {
                                    mandatory: true,
                                    value: 'Infra Lead',
                                    inputType: 'text',
                                },
                                jobDescription: {
                                    mandatory: false,
                                    value: 'Scaled Borg/K8s clusters',
                                    inputType: 'textarea',
                                },
                            },
                        },
                        {
                            id: 'billet-gcp',
                            type: 'job',
                            fields: {
                                jobTitle: {
                                    mandatory: true,
                                    value: 'Cloud Architect',
                                    inputType: 'text',
                                },
                                jobDescription: {
                                    mandatory: false,
                                    value: 'Built GCP networking',
                                    inputType: 'textarea',
                                },
                            },
                        },
                    ],
                },
            },
        ]);

        render(
            <QueryClientProvider client={queryClient}>
                <AddFromLibrarySheet
                    open={true}
                    onOpenChange={jest.fn()}
                    sectionIndex={0}
                    sectionType="experience"
                />
            </QueryClientProvider>
        );

        // Find the ingot heading in the inspector
        const ingotHeading = await screen.findByRole('heading', {
            name: 'Google Experience',
        });
        expect(ingotHeading).toBeInTheDocument();

        // Right pane displays billets
        expect(screen.getByText('Infra Lead')).toBeInTheDocument();
        expect(screen.getByText('Cloud Architect')).toBeInTheDocument();

        // Import to CV
        const importButton = screen.getByRole('button', {
            name: /import to cv/i,
        });
        fireEvent.click(importButton);

        const items =
            useCvDocumentStore.getState().document?.content.sections[0].items;
        expect(items).toHaveLength(1);
        expect(items![0].sourceIngotId).toBe('ingot-google');
        expect(items![0].subItems).toHaveLength(2);
    });
});
