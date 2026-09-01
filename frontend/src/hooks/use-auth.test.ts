import { renderHook, act } from '@testing-library/react';

// Track subscribers at module level
const subscribers = new Set<() => void>();
let mockState = {
    isAuthenticated: false,
    userId: null as string | null,
    loading: true,
};

jest.mock('@/lib/api/auth', () => ({
    subscribe: (cb: () => void) => {
        subscribers.add(cb);
        return () => {
            subscribers.delete(cb);
        };
    },
    getSnapshot: () => mockState,
}));

import { useAuth } from './use-auth';

function updateMockState(next: Partial<typeof mockState>) {
    mockState = { ...mockState, ...next };
    subscribers.forEach((cb) => cb());
}

beforeEach(() => {
    mockState = { isAuthenticated: false, userId: null, loading: true };
    subscribers.clear();
});

describe('useAuth', () => {
    it('returns the current auth state', () => {
        const { result } = renderHook(() => useAuth());

        expect(result.current).toEqual({
            isAuthenticated: false,
            userId: null,
            loading: true,
        });
    });

    it('updates when auth state changes', () => {
        const { result } = renderHook(() => useAuth());

        act(() => {
            updateMockState({
                isAuthenticated: true,
                userId: 'user-123',
                loading: false,
            });
        });

        expect(result.current).toEqual({
            isAuthenticated: true,
            userId: 'user-123',
            loading: false,
        });
    });

    it('updates on sign out', () => {
        mockState = {
            isAuthenticated: true,
            userId: 'user-123',
            loading: false,
        };

        const { result } = renderHook(() => useAuth());

        act(() => {
            updateMockState({
                isAuthenticated: false,
                userId: null,
                loading: false,
            });
        });

        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.userId).toBeNull();
    });

    it('cleans up subscription on unmount', () => {
        const { unmount } = renderHook(() => useAuth());
        expect(subscribers.size).toBe(1);

        unmount();
        expect(subscribers.size).toBe(0);
    });
});
