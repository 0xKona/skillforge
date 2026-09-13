import { render, screen, fireEvent, act } from '@testing-library/react';
import { CvPreviewPane } from './cv-preview-pane';
import { useCvDocumentStore } from '@/lib/store/use-cv-document';

// Mock clipboard API
Object.assign(navigator, {
    clipboard: {
        writeText: jest.fn().mockImplementation(() => Promise.resolve()),
    },
});

describe('CvPreviewPane', () => {
    beforeEach(() => {
        useCvDocumentStore.getState().reset();
    });

    it('renders empty preview state when document has no sections', () => {
        render(<CvPreviewPane />);
        expect(
            screen.getByText('Add a section to see your CV take shape.')
        ).toBeInTheDocument();
    });

    it('renders preview toolbar, page count, and zoom controls when document is populated', () => {
        useCvDocumentStore.getState().setDocument({
            id: 'doc-preview-test',
            version: 1,
            title: 'Test CV',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
            content: {
                sections: [
                    {
                        id: 'sec-1',
                        type: 'experience',
                        title: 'Experience',
                        visible: true,
                        items: [
                            {
                                id: 'item-1',
                                fields: {
                                    companyName: 'Acme Corp',
                                },
                            },
                        ],
                    },
                ],
            },
        });

        render(<CvPreviewPane />);
        expect(screen.getByText('Preview')).toBeInTheDocument();
        expect(screen.getByText('1 Page')).toBeInTheDocument();
        expect(screen.getByLabelText('Zoom out')).toBeInTheDocument();
        expect(screen.getByLabelText('Zoom in')).toBeInTheDocument();
        expect(
            screen.getByLabelText('Copy ATS plain text')
        ).toBeInTheDocument();
    });

    it('copies ATS plain text on button click', async () => {
        useCvDocumentStore.getState().setDocument({
            id: 'doc-copy-test',
            version: 1,
            title: 'ATS Test CV',
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
            content: {
                sections: [
                    {
                        id: 'sec-1',
                        type: 'personal_info',
                        title: 'Personal Info',
                        visible: true,
                        items: [
                            {
                                id: 'pi-1',
                                fields: {
                                    name: 'Jane Doe',
                                    email: 'jane@example.com',
                                },
                            },
                        ],
                    },
                ],
            },
        });

        render(<CvPreviewPane />);
        const copyButton = screen.getByLabelText('Copy ATS plain text');
        await act(async () => {
            fireEvent.click(copyButton);
        });

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
            expect.stringContaining('JANE DOE')
        );
    });
});
