import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';

const client = generateClient<Schema>();

export class BilletService {
    static async createBillet(
        ingotId: string,
        type: string,
        content: Record<string, unknown>
    ) {
        const { data: newBillet, errors } = await client.models.Billet.create({
            ingotId,
            type,
            content: JSON.stringify(content),
        });

        if (errors) {
            throw new Error(`Failed to create Billet: ${errors[0].message}`);
        }

        return newBillet;
    }

    static async updateBillet(id: string, content: Record<string, unknown>) {
        const { data: updatedBillet, errors } =
            await client.models.Billet.update({
                id,
                content: JSON.stringify(content),
            });

        if (errors) {
            throw new Error(`Failed to update Billet: ${errors[0].message}`);
        }

        return updatedBillet;
    }

    static async deleteBillet(id: string) {
        const { errors } = await client.models.Billet.delete({ id });

        if (errors) {
            throw new Error(`Failed to delete Billet: ${errors[0].message}`);
        }
    }

    static async listBilletsForIngot(ingotId: string) {
        const { data: billets, errors } = await client.models.Billet.list({
            filter: { ingotId: { eq: ingotId } },
        });

        if (errors) {
            throw new Error(`Failed to list Billets: ${errors[0].message}`);
        }

        return billets;
    }
}
