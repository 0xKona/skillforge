import { useEffect, useRef } from 'react';
import { useCvEditorState } from '@/lib/store/use-cv-editor';
import { toast } from 'sonner';

export const useCvAutoSave = (intervalMs: number = 30000) => {
    const { cv, originalCv, autoSaveCv } = useCvEditorState();
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

            // If cv has not changed, don't autosave
            if (JSON.stringify(cv) === JSON.stringify(originalCv)) {
                // DEBUG ONLY
                toast('AUTOSAVE SKIPPED [DEBUG ONLY]');
                return;
            }

            autoSaveCv();
            toast('Autosaving CV...');
        }, intervalMs);

        return () => {
            clearInterval(timer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [intervalMs, autoSaveCv]);
};
