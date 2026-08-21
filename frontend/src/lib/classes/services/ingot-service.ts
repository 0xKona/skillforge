import { Ingot, IngotContent, IngotType } from '@/lib/types/ingot-types';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api/client';
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

interface IngotApiResponse {
    id: string;
    name: string;
    type: string;
    content?: string;
    owner: string;
    createdAt: string;
    updatedAt: string;
}

interface ListIngotApiResponse {
    items: IngotApiResponse[];
    nextToken?: string;
}

/**
 * Maps a REST API response item to an Ingot object.
 * Handles the content field by parsing it if it's a JSON string.
 */
const mapToIngot = (item: IngotApiResponse): Ingot => {
    let content: IngotContent;
    if (typeof item.content === 'string' && item.content) {
        try {
            content = JSON.parse(item.content);
        } catch {
            content = {} as IngotContent;
        }
    } else {
        content = {} as IngotContent;
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
 * Service class for managing Ingot objects via the SkillForge REST API.
 * Provides methods for creating, reading, updating, and deleting ingots.
 */
export class IngotService {
    /**
     * Creates a new Ingot.
     */
    static async createIngot(
        type: string,
        name: string,
        content: IngotContent
    ): Promise<Ingot> {
        const response = await apiPost<IngotApiResponse>('/ingot', {
            name,
            type,
            content: JSON.stringify(content),
        });

        return mapToIngot(response);
    }

    /**
     * Retrieves a single Ingot by its ID.
     */
    static async getIngot(id: string): Promise<Ingot | null> {
        try {
            const response = await apiGet<IngotApiResponse>(`/ingot/${id}`);
            return mapToIngot(response);
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

    /**
     * Lists all Ingots, optionally filtered by type.
     */
    static async listIngots(type?: string): Promise<Ingot[]> {
        const params: Record<string, string> = {};
        if (type) {
            params.type = type;
        }

        const response = await apiGet<ListIngotApiResponse>('/ingot', params);
        return response.items.map(mapToIngot);
    }

    /**
     * Lists Ingots with only lightweight fields for the Anvil display.
     */
    static async listAnvilIngotData(): Promise<Ingot[]> {
        const response = await apiGet<ListIngotApiResponse>('/ingot', {
            fields: 'id,name,type,updatedAt',
        });

        return response.items.map(mapToIngot);
    }

    /**
     * Updates an existing Ingot.
     */
    static async updateIngot(
        id: string,
        name: string,
        content: IngotContent
    ): Promise<Ingot> {
        const response = await apiPut<IngotApiResponse>(`/ingot/${id}`, {
            name,
            content: JSON.stringify(content),
        });

        return mapToIngot(response);
    }

    /**
     * Deletes an Ingot.
     */
    static async deleteIngot(id: string): Promise<void> {
        await apiDelete(`/ingot/${id}`);
    }

    /**
     * Deletes all Ingots for the current user.
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
