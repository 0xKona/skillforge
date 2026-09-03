import type {
    CvDocument,
    DocumentContent,
    NewCvDocument,
} from '../types/cv-document-types';
import { apiDelete, apiGet, apiPost, apiPut } from './client';

// API response types - internal to this module
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

interface ListCvApiResponse {
    items: CvApiResponse[];
    nextToken?: string;
}

function mapDbResponseToDocument(item: CvApiResponse): CvDocument {
    let content: DocumentContent;
    if (typeof item.cvContent === 'string' && item.cvContent) {
        try {
            content = JSON.parse(item.cvContent) as DocumentContent;
        } catch {
            content = { sections: [] };
        }
    } else {
        content = { sections: [] };
    }

    return {
        id: item.id,
        title: item.title,
        description: item.description ?? undefined,
        version: item.version,
        content,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
    };
}

async function createCv(cvData: NewCvDocument): Promise<CvDocument> {
    const response = await apiPost<CvApiResponse>('/cv', {
        title: cvData.title,
        description: cvData.description,
        version: cvData.version,
        cvContent: JSON.stringify(cvData.content),
    });
    return mapDbResponseToDocument(response);
}

async function getCvById(id: string): Promise<CvDocument> {
    const response = await apiGet<CvApiResponse>(`/cv/${id}`);
    return mapDbResponseToDocument(response);
}

async function getAllCvsForUser(): Promise<CvDocument[]> {
    const response = await apiGet<ListCvApiResponse>('/cv');
    return response.items.map(mapDbResponseToDocument);
}

async function updateCv(cv: CvDocument): Promise<CvDocument> {
    const response = await apiPut<CvApiResponse>(`/cv/${cv.id}`, {
        title: cv.title,
        description: cv.description,
        version: cv.version,
        cvContent: JSON.stringify(cv.content),
    });
    return mapDbResponseToDocument(response);
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
