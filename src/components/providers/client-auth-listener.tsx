'use client';

import { useEffect } from 'react';
import { useClientAuth } from '@/lib/store/use-client-auth';

// When app loads, subscribe to changes in the users details, ensuring changes are reflected in the UI.
// Use this within the main layout component.
export function ClientAuthListener() {
    const initialize = useClientAuth((state) => state.initialize);

    useEffect(() => {
        const unsubscribe = initialize();
        return () => unsubscribe();
    }, [initialize]);

    return null;
}
