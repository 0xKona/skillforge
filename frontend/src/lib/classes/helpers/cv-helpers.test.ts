import CvHelpers from './cv-helpers';
import { Schema } from '@amplify/data/resource';

describe('CvHelpers', () => {
    describe('mapDbDataToCv', () => {
        it('maps basic fields correctly', () => {
            const mockDbItem = {
                id: 'cv-123',
                title: 'My CV',
                description: 'A test CV',
                version: 1,
                cvContent: { sections: [] }, // Object format
                createdAt: '2023-01-01T00:00:00Z',
                updatedAt: '2023-01-02T00:00:00Z',
            } as unknown as Schema['CV']['type'];

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
            const mockDbItem = {
                id: 'cv-123',
                title: 'My CV',
                cvContent: JSON.stringify(contentObj), // String format
                createdAt: '2023-01-01',
                updatedAt: '2023-01-01',
            } as unknown as Schema['CV']['type'];

            const result = CvHelpers.mapDbDataToCv(mockDbItem);

            // Should be parsed back to an object
            expect(result.cvContent).toEqual(contentObj);
        });

        it('returns empty sections if JSON parsing fails', () => {
            const mockDbItem = {
                id: 'cv-123',
                title: 'My CV',
                cvContent: '{ invalid json }', // Malformed JSON
                createdAt: '2023-01-01',
                updatedAt: '2023-01-01',
            } as unknown as Schema['CV']['type'];

            const result = CvHelpers.mapDbDataToCv(mockDbItem);

            // Fallback to empty sections
            expect(result.cvContent).toEqual({ sections: [] });
        });
    });
});
