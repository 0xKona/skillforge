import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cvApi } from '@/lib/api/cv';
import type { CvDocument, NewCvDocument } from '@/lib/types/cv-document-types';

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
        mutationFn: (cvData: NewCvDocument) => cvApi.createCv(cvData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cvKeys.all });
        },
    });
}

export function useUpdateCv() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (cv: CvDocument) => cvApi.updateCv(cv),
        onSuccess: (updatedCv: CvDocument) => {
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
