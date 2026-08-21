import { CV, NewCV } from '@/lib/types/cv-types';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api/client';
import CvHelpers, { CvApiResponse } from '../helpers/cv-helpers';

interface ListCvApiResponse {
    items: CvApiResponse[];
    nextToken?: string;
}

/**
 * Service class for managing CV objects via the SkillForge REST API.
 * Provides methods for creating, reading, updating, and deleting CVs.
 */
export class CvService {
    /**
     * Creates a new CV.
     */
    static async createCv(cvData: NewCV): Promise<CV> {
        const response = await apiPost<CvApiResponse>('/cv', {
            title: cvData.title,
            description: cvData.description,
            version: cvData.version,
            cvContent: JSON.stringify(cvData.cvContent),
        });

        return CvHelpers.mapDbDataToCv(response);
    }

    /**
     * Retrieves a single CV by its ID.
     */
    static async getCv(id: string): Promise<CV | null> {
        try {
            const response = await apiGet<CvApiResponse>(`/cv/${id}`);
            return CvHelpers.mapDbDataToCv(response);
        } catch (error) {
            if (
                error instanceof Error &&
                'status' in error &&
                (error as { status: number }).status === 404
            ) {
                return null;
            }
            throw error;
        }
    }

    /**
     * Lists all CVs for the authenticated user.
     */
    static async listCvs(): Promise<CV[]> {
        const response = await apiGet<ListCvApiResponse>('/cv');
        return response.items.map(CvHelpers.mapDbDataToCv);
    }

    /**
     * Updates an existing CV.
     */
    static async updateCv(cv: CV): Promise<CV> {
        const response = await apiPut<CvApiResponse>(`/cv/${cv.id}`, {
            title: cv.title,
            description: cv.description,
            version: cv.version,
            cvContent: JSON.stringify(cv.cvContent),
        });

        return CvHelpers.mapDbDataToCv(response);
    }

    /**
     * Deletes a CV.
     */
    static async deleteCv(id: string): Promise<void> {
        await apiDelete(`/cv/${id}`);
    }

    /**
     * Deletes all CVs for the current user.
     */
    static async deleteAllCvs(): Promise<void> {
        const cvs = await this.listCvs();
        const deletePromises = cvs.map((cv) => this.deleteCv(cv.id));
        await Promise.all(deletePromises);
    }
}
