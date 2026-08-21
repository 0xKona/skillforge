import { CV, CvContent } from '../../types/cv-types';

interface CvApiResponse {
    id: string;
    title: string;
    description?: string | null;
    version: number;
    cvContent?: string;
    owner: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Utility class providing helper methods for managing CV objects.
 */
export default class CvHelpers {
    /**
     * Maps a REST API response to a CV object.
     * Handles the cvContent field by parsing it if it's a JSON string.
     */
    static mapDbDataToCv(item: CvApiResponse): CV {
        let cvContent: CvContent;
        if (typeof item.cvContent === 'string' && item.cvContent) {
            try {
                cvContent = JSON.parse(item.cvContent);
            } catch {
                cvContent = { sections: [] };
            }
        } else {
            cvContent = { sections: [] };
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

export type { CvApiResponse };
