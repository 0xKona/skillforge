import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';
import { Ingot, IngotContent, IngotType } from '@/lib/types/ingot-types';
import {
    Award,
    Briefcase,
    FileText,
    GraduationCap,
    User,
    LucideIcon,
    Volleyball,
    Brain,
    Headset,
    Hammer,
} from 'lucide-react';
import MappingHelpers from '../helpers/mapping-helpers';

const client = generateClient<Schema>();

/**
 * Maps a database item to an Ingot object.
 * Handles the content field by parsing it if it's a JSON string, or using it directly if it's an object.
 * If parsing fails, defaults to an empty IngotContent object.
 * @param item - The database item to map.
 * @returns An Ingot object with mapped fields including parsed content.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapToIngot = (item: any): Ingot => {
    let content: IngotContent;
    // Handle content if it's a string (JSON stringified) or object
    if (typeof item.content === 'string') {
        try {
            content = JSON.parse(item.content);
        } catch {
            content = {} as IngotContent;
        }
    } else {
        content = item.content as IngotContent;
    }

    return {
        id: item.id,
        name: item.name,
        type: item.type,
        content,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
    };
};

/**
 * Service class for managing Ingot objects via AWS Amplify client.
 * Provides methods for creating, reading, updating, and deleting ingots, as well as utility methods for display details.
 */
export class IngotService {
    /**
     * Creates a new Ingot in the database.
     * @param type - The type of the ingot.
     * @param name - The name of the ingot.
     * @param content - The content of the ingot.
     * @returns A Promise that resolves to the created Ingot object.
     */
    static async createIngot(
        type: string,
        name: string,
        content: IngotContent
    ): Promise<Ingot> {
        const { data: newIngot, errors } = await client.models.Ingot.create({
            name,
            type,
            content: JSON.stringify(content),
        });

        if (errors) {
            throw new Error(`Failed to create Ingot: ${errors[0].message}`);
        }

        return mapToIngot(newIngot);
    }

    /**
     * Retrieves a single Ingot by its ID.
     * @param id - The ID of the ingot to retrieve.
     * @returns A Promise that resolves to the Ingot object or null if not found.
     */
    static async getIngot(id: string): Promise<Ingot | null> {
        const { data: ingot, errors } = await client.models.Ingot.get({ id });

        if (errors) {
            throw new Error(`Failed to get Ingot: ${errors[0].message}`);
        }

        if (!ingot) return null;

        return mapToIngot(ingot);
    }

    /**
     * Lists all Ingots, optionally filtered by type.
     * @param type - Optional type to filter the ingots.
     * @returns A Promise that resolves to an array of Ingot objects.
     */
    static async listIngots(type?: string): Promise<Ingot[]> {
        const { data: ingots, errors } = await client.models.Ingot.list({
            filter: type ? { type: { eq: type } } : undefined,
        });

        if (errors) {
            throw new Error(`Failed to list Ingots: ${errors[0].message}`);
        }

        return ingots.map(mapToIngot);
    }

    /**
     * Lists Ingots with a limited selection set for anvil display.
     * @returns A Promise that resolves to an array of Ingot objects with selected fields.
     */
    static async listAnvilIngotData(): Promise<Ingot[]> {
        const { data: ingots, errors } = await client.models.Ingot.list({
            selectionSet: ['id', 'name', 'type', 'updatedAt'],
        });

        if (errors) {
            throw new Error(`Failed to list Ingots: ${errors[0].message}`);
        }

        return ingots.map(mapToIngot);
    }

    /**
     * Updates an existing Ingot in the database.
     * @param id - The ID of the ingot to update.
     * @param name - The new name of the ingot.
     * @param content - The new content of the ingot.
     * @returns A Promise that resolves to the updated Ingot object.
     */
    static async updateIngot(
        id: string,
        name: string,
        content: IngotContent
    ): Promise<Ingot> {
        const updates = {
            id,
            name,
            content: JSON.stringify(content),
        };

        const { data: updatedIngot, errors } =
            await client.models.Ingot.update(updates);

        if (errors) {
            throw new Error(`Failed to update Ingot: ${errors[0].message}`);
        }

        return mapToIngot(updatedIngot);
    }

    /**
     * Deletes an Ingot from the database.
     * @param id - The ID of the ingot to delete.
     * @returns A Promise that resolves when the deletion is complete.
     */
    static async deleteIngot(id: string) {
        const { errors } = await client.models.Ingot.delete({ id });

        if (errors) {
            throw new Error(`Failed to delete Ingot: ${errors[0].message}`);
        }
    }

    /**
     * Deletes all Ingots for the current user.
     * @returns A Promise that resolves when all Ingots are deleted.
     */
    static async deleteAllIngots(): Promise<void> {
        const ingots = await this.listIngots();
        const deletePromises = ingots.map((ingot) =>
            this.deleteIngot(ingot.id)
        );
        await Promise.all(deletePromises);
    }

    /**
     * Gets display details for an anvil card based on the ingot type.
     * @param type - The type of the ingot.
     * @returns An object containing the label, color, and icon for the card.
     */
    static getAnvilCardDisplayDetails(type: string) {
        const label = MappingHelpers.getIngotLabelByType(type as IngotType);

        const detailsMap: Record<string, { color: string; icon: LucideIcon }> =
            {
                ingot_education: { color: 'bg-blue-500', icon: GraduationCap },
                ingot_experience: { color: 'bg-emerald-500', icon: Briefcase },
                ingot_project: { color: 'bg-purple-500', icon: Hammer },
                ingot_certification: {
                    color: 'bg-amber-500',
                    icon: Award,
                },
                ingot_personal_info: { color: 'bg-rose-500', icon: User },
                ingot_personal_statement: {
                    color: 'bg-pink-500',
                    icon: FileText,
                },
                ingot_skill: { color: 'bg-indigo-500', icon: Brain },
                ingot_hobby: { color: 'bg-orange-500', icon: Volleyball },
                ingot_reference: { color: 'bg-teal-500', icon: Headset },
            };

        const details = detailsMap[type] || {
            color: 'bg-slate-500',
            icon: FileText,
        };

        return {
            ...details,
            label,
        };
    }
}
