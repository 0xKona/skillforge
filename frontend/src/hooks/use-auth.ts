import { useSyncExternalStore } from 'react';
import { subscribe, getSnapshot, type AuthState } from '@/lib/api/auth';

/** Reactive auth state hook. Subscribes to the auth module's state. */
export function useAuth(): AuthState {
    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
