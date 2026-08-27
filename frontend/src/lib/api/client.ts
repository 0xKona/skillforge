import { getAuthToken, signOut } from '@/lib/api/auth';
import { backendConfig } from '@/lib/constants/backend';

/*
Errors in this API 'package' are not caught or handled, all API's are thrown and
should be dealt with at the data integrity layer by useQuery.
*/

// Error Class for API Errors
export class ApiError extends Error {
    constructor(
        public status: number,
        message: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

// Request Helper Function, build api url and request.
async function request<T>(
    method: string,
    path: string,
    body?: unknown,
    params?: Record<string, string>
): Promise<T> {
    const token = await getAuthToken();

    let url = `${backendConfig.apiUrl}${path}`;
    if (params) {
        const searchParams = new URLSearchParams(
            Object.entries(params).filter(
                ([, v]) => v !== undefined && v !== ''
            )
        );
        if (searchParams.toString()) {
            url += `?${searchParams.toString()}`;
        }
    }

    const response = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const message =
            (errorBody as { error?: string }).error ||
            `Request failed with status ${response.status}`;

        if (response.status === 401) {
            await signOut();
        }

        throw new ApiError(response.status, message);
    }

    return response.json() as Promise<T>;
}

// --- Abstracted API Functions for each method ---

export async function apiGet<T>(
    path: string,
    params?: Record<string, string>
): Promise<T> {
    return request<T>('GET', path, undefined, params);
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
    return request<T>('POST', path, body);
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
    return request<T>('PUT', path, body);
}

export async function apiDelete<T>(path: string): Promise<T> {
    return request<T>('DELETE', path);
}
