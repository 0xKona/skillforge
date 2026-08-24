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
    return mapToIngot(response);
}

async function getIngot(id: string): Promise<Ingot> {
    const response = await apiGet<IngotApiResponse>(`/ingot/${id}`);
    return mapToIngot(response);
}

async function getAllIngots(ingotType?: IngotType): Promise<Ingot[]> {
    const apiParams: Record<string, string> = {};
    if (ingotType) {
        apiParams.type = ingotType;
    }

    const response = await apiGet<ListIngotApiResponse>('/ingot', apiParams);
    return response.items.map(mapToIngot);
}

async function updateIngot(
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

async function deleteIngot(id: string): Promise<void> {
    await apiDelete(`/ingot/${id}`);
}

export const ingotApi = {
    createIngot,
    getIngot,
    getAllIngots,
    updateIngot,
    deleteIngot,
};
