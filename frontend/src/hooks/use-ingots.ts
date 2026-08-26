import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ingotApi } from '@/lib/api/ingot';
import { Ingot, IngotContent, IngotType } from '@/lib/types/ingot-types';

// -- Query Key Factory --

export const ingotKeys = {
    all: ['ingots'] as const,
    list: (type?: IngotType) =>
        type ? (['ingots', { type }] as const) : (['ingots'] as const),
    detail: (id: string) => ['ingots', id] as const,
};

// -- Queries --

export function useIngots(type?: IngotType) {
    return useQuery({
        queryKey: ingotKeys.list(type),
        queryFn: () => ingotApi.getAllIngots(type),
    });
}

export function useIngot(id: string) {
    return useQuery({
        queryKey: ingotKeys.detail(id),
        queryFn: () => ingotApi.getIngot(id),
        enabled: !!id,
    });
}

// -- Mutations --

export function useCreateIngot() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (variables: {
            type: string;
            name: string;
            content: IngotContent;
        }) =>
            ingotApi.createIngot(
                variables.type,
                variables.name,
                variables.content
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ingotKeys.all });
        },
    });
}

export function useUpdateIngot() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (variables: {
            id: string;
            name: string;
            content: IngotContent;
        }) =>
            ingotApi.updateIngot(
                variables.id,
                variables.name,
                variables.content
            ),
        onSuccess: (updatedIngot: Ingot) => {
            // Update the individual cache entry
            queryClient.setQueryData(
                ingotKeys.detail(updatedIngot.id),
                updatedIngot
            );
            // Invalidate the list so it re-fetches
            queryClient.invalidateQueries({ queryKey: ingotKeys.all });
        },
    });
}

export function useDeleteIngot() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ingotApi.deleteIngot(id),
        onSuccess: (_data, id) => {
            // Remove from cache immediately
            queryClient.removeQueries({ queryKey: ingotKeys.detail(id) });
            // Invalidate the list
            queryClient.invalidateQueries({ queryKey: ingotKeys.all });
        },
    });
}
