import { useEffect, useRef } from 'react';
import { useCvDocumentStore } from '@/lib/store/use-cv-document';
import { useUpdateCv } from '@/hooks/use-cvs';
import type { CvDocument } from '@/lib/types/cv-document-types';

/**
 * Auto-saves the CV document when changes are detected.
 * Uses a debounce approach — waits for `debounceMs` after the last change
 * before saving. Only saves if the document is dirty and has an ID (persisted).
 */
export function useCvAutoSave(debounceMs = 3000) {
    const document = useCvDocumentStore((s) => s.document);
    const isDirty = useCvDocumentStore((s) => s.isDirty);
    const markSaved = useCvDocumentStore((s) => s.markSaved);
    const updateCv = useUpdateCv();
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        // Only auto-save if dirty, document exists, and has an ID (not new)
        if (!isDirty || !document || !('id' in document) || !document.id) {
            return;
        }

        // Clear any existing timer
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        // Set a new debounce timer
        timerRef.current = setTimeout(() => {
            updateCv.mutate(document as CvDocument, {
                onSuccess: () => markSaved(),
            });
        }, debounceMs);

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [isDirty, document, debounceMs, markSaved, updateCv]);
}
