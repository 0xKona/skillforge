import {
    CV,
    CvApiResponse,
    CvContent,
    ListCvApiResponse,
    NewCV,
} from '../types/cv-types';
import { apiDelete, apiGet, apiPost, apiPut } from './client';

function mapDbResponseToCv(item: CvApiResponse): CV {
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

// Create CV
async function createCv(cvData: NewCV): Promise<CV> {
    const response = await apiPost<CvApiResponse>('/cv', {
        title: cvData.title,
        description: cvData.description,
        version: cvData.version,
        cvContent: JSON.stringify(cvData.cvContent),
    });

    const cv = mapDbResponseToCv(response);
    return cv;
}

// Get CV by ID
async function getCvById(id: string): Promise<CV | null> {
    try {
        const response = await apiGet<CvApiResponse>(`/cv/${id}`);
        return mapDbResponseToCv(response);
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

// Get all CVs for user
async function getAllCvsForUser(): Promise<CV[]> {
    const response = await apiGet<ListCvApiResponse>('/cv');
    const cvList = response.items.map(mapDbResponseToCv);
    return cvList;
}

// Update existing CV
async function updateCv(cv: CV): Promise<CV> {
    const response = await apiPut<CvApiResponse>(`/cv/${cv.id}`, {
        title: cv.title,
        description: cv.description,
        version: cv.version,
        cvContent: JSON.stringify(cv.cvContent),
    });

    const updatedCv = mapDbResponseToCv(response);
    return updatedCv;
}

// Delete a CV by ID
async function deleteCvById(id: string): Promise<void> {
    await apiDelete(`/cv/${id}`);
}

export const cvApi = {
    createCv,
    getCvById,
    getAllCvsForUser,
    updateCv,
    deleteCvById,
};
