import CvHelpers, { CvApiResponse } from './cv-helpers';

describe('CvHelpers', () => {
    describe('mapDbDataToCv', () => {
        it('maps basic fields correctly', () => {
            const mockDbItem: CvApiResponse = {
                id: 'cv-123',
                title: 'My CV',
                description: 'A test CV',
                version: 1,
                cvContent: JSON.stringify({ sections: [] }),
                owner: 'user-123',
                createdAt: '2023-01-01T00:00:00Z',
                updatedAt: '2023-01-02T00:00:00Z',
            };

            const result = CvHelpers.mapDbDataToCv(mockDbItem);

            expect(result).toEqual({
                id: 'cv-123',
                title: 'My CV',
                description: 'A test CV',
                version: 1,
                cvContent: { sections: [] },
                createdAt: '2023-01-01T00:00:00Z',
                updatedAt: '2023-01-02T00:00:00Z',
            });
        });

        it('parses cvContent when it is a JSON string', () => {
            const contentObj = {
                sections: [
                    {
                        sectionType: 'ingot_experience',
                        ingotIds: [],
                        billetIds: [],
                        sortBilletsBy: 'date-desc',
                    },
                ],
            };
            const mockDbItem: CvApiResponse = {
                id: 'cv-123',
                title: 'My CV',
                version: 1,
                cvContent: JSON.stringify(contentObj),
                owner: 'user-123',
                createdAt: '2023-01-01',
                updatedAt: '2023-01-01',
            };

            const result = CvHelpers.mapDbDataToCv(mockDbItem);

            expect(result.cvContent).toEqual(contentObj);
        });

        it('returns empty sections if JSON parsing fails', () => {
            const mockDbItem: CvApiResponse = {
                id: 'cv-123',
                title: 'My CV',
                version: 1,
                cvContent: '{ invalid json }',
                owner: 'user-123',
                createdAt: '2023-01-01',
                updatedAt: '2023-01-01',
            };

            const result = CvHelpers.mapDbDataToCv(mockDbItem);

            expect(result.cvContent).toEqual({ sections: [] });
        });

        it('returns empty sections if cvContent is undefined', () => {
            const mockDbItem: CvApiResponse = {
                id: 'cv-123',
                title: 'My CV',
                version: 1,
                owner: 'user-123',
                createdAt: '2023-01-01',
                updatedAt: '2023-01-01',
            };

            const result = CvHelpers.mapDbDataToCv(mockDbItem);

            expect(result.cvContent).toEqual({ sections: [] });
        });
    });
});
