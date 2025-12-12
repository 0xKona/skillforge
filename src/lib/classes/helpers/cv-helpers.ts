import type { Schema } from '@amplify/data/resource';
import { CV, CvContent } from '../../types/cv-types';

export default class CvHelpers {
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
