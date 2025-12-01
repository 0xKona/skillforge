import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';

const client = generateClient<Schema>();

export class IngotService {
    static async createIngot(
        type: string,
        name: string,
        content: Record<string, unknown>,
        billets: unknown[] = []
    ) {
        const { data: newIngot, errors } = await client.models.Ingot.create({
            name,
            type,
            content: JSON.stringify(content),
            billets: JSON.stringify(billets),
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

    static async updateIngot(
        id: string,
        name: string,
        content: Record<string, unknown>,
        billets?: unknown[]
    ) {
        const updates: {
            id: string;
            name: string;
            content: string;
            billets?: string;
        } = {
            id,
            name,
            content: JSON.stringify(content),
        };

        if (billets) {
            updates.billets = JSON.stringify(billets);
        }

        const { data: updatedIngot, errors } =
            await client.models.Ingot.update(updates);

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
}
