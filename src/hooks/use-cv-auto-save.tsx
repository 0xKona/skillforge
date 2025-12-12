import { useEffect, useRef } from 'react';
import { useCvEditorState } from '@/lib/store/use-cv-editor';

export const useCvAutoSave = (intervalMs: number = 30000) => {
    const { cv, autoSaveCv } = useCvEditorState();
    const cvRef = useRef(cv);

    // Keep ref updated with latest CV state so the interval closure has access to it
    useEffect(() => {
        cvRef.current = cv;
    }, [cv]);

    useEffect(() => {
        const timer = setInterval(() => {
            const currentCv = cvRef.current;

            // If no CV or no ID, don't autosave
            if (!currentCv || !('id' in currentCv)) return;

            autoSaveCv();
        }, intervalMs);

        return () => {
            clearInterval(timer);
        };
    }, [intervalMs, autoSaveCv]);
};
