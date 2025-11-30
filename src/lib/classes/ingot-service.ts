import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';

const client = generateClient<Schema>();

export class IngotService {
    static async createIngot(
        type: string,
        name: string,
        content: Record<string, unknown>
    ) {
        const { data: newIngot, errors } = await client.models.Ingot.create({
            name,
            type,
            content: JSON.stringify(content),
        });

        if (errors) {
            throw new Error(`Failed to create Ingot: ${errors[0].message}`);
        }

        return newIngot;
    }

    static async getIngot(id: string) {
        const { data: ingot, errors } = await client.models.Ingot.get({ id });

        if (errors) {
            throw new Error(`Failed to get Ingot: ${errors[0].message}`);
        }

        return ingot;
    }

    static async listIngots(type?: string) {
        const { data: ingots, errors } = await client.models.Ingot.list({
            filter: type ? { type: { eq: type } } : undefined,
        });

        if (errors) {
            throw new Error(`Failed to list Ingots: ${errors[0].message}`);
        }

        return ingots;
    }

    static async updateIngot(id: string, content: Record<string, unknown>) {
        const { data: updatedIngot, errors } = await client.models.Ingot.update(
            {
                id,
                content: JSON.stringify(content),
            }
        );

        if (errors) {
            throw new Error(`Failed to update Ingot: ${errors[0].message}`);
        }

        return updatedIngot;
    }

    static async deleteIngot(id: string) {
        const { errors } = await client.models.Ingot.delete({ id });

        if (errors) {
            throw new Error(`Failed to delete Ingot: ${errors[0].message}`);
        }
    }

    static async getIngotWithBillets(id: string) {
        const { data: ingot, errors } = await client.models.Ingot.get({ id });

        if (errors || !ingot) {
            throw new Error(errors ? errors[0].message : 'Ingot not found');
        }

        // Fetch billets separately as lazy loading might need explicit call or configuration
        // For now, let's assume we can list billets filtering by ingotId if the relationship doesn't auto-fetch deeply
        const { data: billets } = await client.models.Billet.list({
            filter: { ingotId: { eq: id } },
        });

        return { ...ingot, billets };
    }
}
