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

async function createCv(cvData: NewCV): Promise<CV> {
    const response = await apiPost<CvApiResponse>('/cv', {
        title: cvData.title,
        description: cvData.description,
        version: cvData.version,
        cvContent: JSON.stringify(cvData.cvContent),
    });
    return mapDbResponseToCv(response);
}

async function getCvById(id: string): Promise<CV> {
    const response = await apiGet<CvApiResponse>(`/cv/${id}`);
    return mapDbResponseToCv(response);
}

async function getAllCvsForUser(): Promise<CV[]> {
    const response = await apiGet<ListCvApiResponse>('/cv');
    return response.items.map(mapDbResponseToCv);
}

async function updateCv(cv: CV): Promise<CV> {
    const response = await apiPut<CvApiResponse>(`/cv/${cv.id}`, {
        title: cv.title,
        description: cv.description,
        version: cv.version,
        cvContent: JSON.stringify(cv.cvContent),
    });
    return mapDbResponseToCv(response);
}

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
