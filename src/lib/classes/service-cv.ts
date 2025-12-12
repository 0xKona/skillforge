import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';
import { CV, NewCV } from '@/lib/types/cv-types';
import CvHelpers from './helpers/cv-helpers';

const client = generateClient<Schema>();

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

        if (!newCv) {
            throw new Error('Failed to create CV: No data returned');
        }

        return CvHelpers.mapDbDataToCv(newCv);
    }

    static async getCv(id: string): Promise<CV | null> {
        const { data: cv, errors } = await client.models.CV.get({ id });

        if (errors) {
            throw new Error(`Failed to get CV: ${errors[0].message}`);
        }

        if (!cv) return null;

        return CvHelpers.mapDbDataToCv(cv);
    }

    static async listCvs(): Promise<CV[]> {
        const { data: cvs, errors } = await client.models.CV.list();

        if (errors) {
            throw new Error(`Failed to list CVs: ${errors[0].message}`);
        }

        return cvs.map(CvHelpers.mapDbDataToCv);
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

        if (!updatedCv) {
            throw new Error('Failed to update CV: No data returned');
        }

        return CvHelpers.mapDbDataToCv(updatedCv);
    }

    static async deleteCv(id: string): Promise<void> {
        const { errors } = await client.models.CV.delete({ id });

        if (errors) {
            throw new Error(`Failed to delete CV: ${errors[0].message}`);
        }
    }
}
