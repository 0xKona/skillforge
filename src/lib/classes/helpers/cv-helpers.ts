import type { Schema } from '@amplify/data/resource';
import { CV, CvContent } from '../../types/cv-types';

/**
 * Utility class providing helper methods for managing CV (Curriculum Vitae) objects.
 * This class includes methods for mapping database data to CV objects, handling data transformations and parsing.
 */
export default class CvHelpers {
    /**
     * Maps database data from the Schema['CV']['type'] to a CV object.
     * Handles the cvContent field by parsing it if it's a JSON string, or using it directly if it's an object.
     * If parsing fails, defaults to an empty sections array.
     * @param item - The database item of type Schema['CV']['type'] to map.
     * @returns A CV object with mapped fields including parsed cvContent.
     */
    static mapDbDataToCv(item: Schema['CV']['type']): CV {
        let cvContent: CvContent;
        // Handle content if it's a string (JSON stringified) or object
        if (typeof item.cvContent === 'string') {
            try {
                cvContent = JSON.parse(item.cvContent);
            } catch {
                cvContent = { sections: [] };
            }
        } else {
            cvContent = item.cvContent as CvContent;
        }

        return {
            id: item.id,
            title: item.title,
            description: item.description,
            version: item.version,
            cvContent,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
        };
    }
}
