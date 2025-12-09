import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';
import { CV, CvContent, NewCV } from '@/lib/types/cv-types';

const client = generateClient<Schema>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapToCv = (item: any): CV => {
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
};

export class CvService {
    static async createCv(cvData: NewCV): Promise<CV> {
        const { data: newCv, errors } = await client.models.CV.create({
            title: cvData.title,
            description: cvData.description,
            version: cvData.version,
            cvContent: JSON.stringify(cvData.cvContent),
        });

        if (errors) {
            throw new Error(`Failed to create CV: ${errors[0].message}`);
        }

        return mapToCv(newCv);
    }

    static async getCv(id: string): Promise<CV | null> {
        const { data: cv, errors } = await client.models.CV.get({ id });

        if (errors) {
            throw new Error(`Failed to get CV: ${errors[0].message}`);
        }

        if (!cv) return null;

        return mapToCv(cv);
    }

    static async listCvs(): Promise<CV[]> {
        const { data: cvs, errors } = await client.models.CV.list();

        if (errors) {
            throw new Error(`Failed to list CVs: ${errors[0].message}`);
        }

        return cvs.map(mapToCv);
    }

    static async updateCv(cv: CV): Promise<CV> {
        const { data: updatedCv, errors } = await client.models.CV.update({
            id: cv.id,
            title: cv.title,
            description: cv.description,
            version: cv.version,
            cvContent: JSON.stringify(cv.cvContent),
        });

        if (errors) {
            throw new Error(`Failed to update CV: ${errors[0].message}`);
        }

        return mapToCv(updatedCv);
    }

    static async deleteCv(id: string): Promise<void> {
        const { errors } = await client.models.CV.delete({ id });

        if (errors) {
            throw new Error(`Failed to delete CV: ${errors[0].message}`);
        }
    }
}
