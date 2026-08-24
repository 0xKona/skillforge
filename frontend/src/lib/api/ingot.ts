import {
    Ingot,
    IngotApiResponse,
    IngotContent,
    IngotType,
    ListIngotApiResponse,
} from '../types/ingot-types';
import { apiDelete, apiGet, apiPost, apiPut } from './client';

/**
 * Maps a REST API response item to an Ingot object.
 * Handles the content field by parsing it if it's a JSON string.
 */
function mapToIngot(item: IngotApiResponse): Ingot {
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
        type: item.type as IngotType,
        content,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
    };
}

// Create a new Ingot
async function createIngot(
    type: string,
    name: string,
    content: IngotContent
): Promise<Ingot> {
    const response = await apiPost<IngotApiResponse>('/ingot', {
        name,
        type,
        content: JSON.stringify(content),
    });
    const ingot = mapToIngot(response);
    return ingot;
}

// Get a single ingot by ID.
async function getingot(id: string): Promise<Ingot | null> {
    try {
        const response = await apiGet<IngotApiResponse>(`/ingot/${id}`);
        const ingot = mapToIngot(response);
        return ingot;
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Get all Ingots, optionally filtered by type, returned as array
async function getAllIngots(ingotType?: IngotType): Promise<Ingot[]> {
    // Set optional ingotType as parameter filter
    const apiParams: Record<string, string> = {};
    if (ingotType) {
        apiParams.type = ingotType;
    }

    const response = await apiGet<ListIngotApiResponse>('/ingot', apiParams);
    return response.items.map(mapToIngot);
}

// Update and existing ingot
async function updateIngot(
    id: string,
    name: string,
    content: IngotContent
): Promise<Ingot> {
    const response = await apiPut<IngotApiResponse>(`/ingot/${id}`, {
        name,
        content: JSON.stringify(content),
    });

    const ingot = mapToIngot(response);
    return ingot;
}

// Delete a single ingot by ID
async function deleteIngot(id: string): Promise<void> {
    await apiDelete(`/ingot/${id}`);
}

export const ingotApi = {
    createIngot,
    getIngot: getingot,
    getAllIngots,
    updateIngot,
    deleteIngot,
};
