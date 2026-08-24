import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cvApi } from '@/lib/api/cv';
import { CV, NewCV } from '@/lib/types/cv-types';

// -- Query Key Factory --

export const cvKeys = {
    all: ['cvs'] as const,
    list: () => ['cvs'] as const,
    detail: (id: string) => ['cvs', id] as const,
};

// -- Queries --

export function useCvs() {
    return useQuery({
        queryKey: cvKeys.list(),
        queryFn: () => cvApi.getAllCvsForUser(),
    });
}

export function useCv(id: string) {
    return useQuery({
        queryKey: cvKeys.detail(id),
        queryFn: () => cvApi.getCvById(id),
        enabled: !!id,
    });
}

// -- Mutations --

export function useCreateCv() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (cvData: NewCV) => cvApi.createCv(cvData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cvKeys.all });
        },
    });
}

export function useUpdateCv() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (cv: CV) => cvApi.updateCv(cv),
        onSuccess: (updatedCv: CV) => {
            queryClient.setQueryData(cvKeys.detail(updatedCv.id), updatedCv);
            queryClient.invalidateQueries({ queryKey: cvKeys.all });
        },
    });
}

export function useDeleteCv() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => cvApi.deleteCvById(id),
        onSuccess: (_data, id) => {
            queryClient.removeQueries({ queryKey: cvKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: cvKeys.all });
        },
    });
}
