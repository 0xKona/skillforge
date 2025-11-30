import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';
import { CvStructure } from '@/lib/types/data-types';

const client = generateClient<Schema>();

export class CvService {
    static async createCv(
        title: string,
        structure: CvStructure,
        description?: string
    ) {
        const { data: newCv, errors } = await client.models.CV.create({
            title,
            description,
            structure: JSON.stringify(structure),
            isPublic: false,
        });

        if (errors) {
            throw new Error(`Failed to create CV: ${errors[0].message}`);
        }

        return newCv;
    }

    static async getCv(id: string) {
        const { data: cv, errors } = await client.models.CV.get({ id });

        if (errors) {
            throw new Error(`Failed to get CV: ${errors[0].message}`);
        }

        return cv;
    }

    static async listCvs() {
        const { data: cvs, errors } = await client.models.CV.list();

        if (errors) {
            throw new Error(`Failed to list CVs: ${errors[0].message}`);
        }

        return cvs;
    }

    static async updateCv(id: string, updates: Partial<Schema['CV']['type']>) {
        // If structure is being updated, ensure it's stringified if it's an object
        const safeUpdates = { ...updates };
        if (typeof safeUpdates.structure === 'object') {
            safeUpdates.structure = JSON.stringify(safeUpdates.structure);
        }

        const { data: updatedCv, errors } = await client.models.CV.update({
            id,
            ...safeUpdates,
        });

        if (errors) {
            throw new Error(`Failed to update CV: ${errors[0].message}`);
        }

        return updatedCv;
    }

    static async deleteCv(id: string) {
        const { errors } = await client.models.CV.delete({ id });

        if (errors) {
            throw new Error(`Failed to delete CV: ${errors[0].message}`);
        }
    }
}
