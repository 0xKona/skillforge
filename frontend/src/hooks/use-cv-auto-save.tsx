import { useEffect, useRef } from 'react';
import { useCvEditorState } from '@/lib/store/use-cv-editor';
import { useUpdateCv } from '@/hooks/use-cvs';
import { toast } from 'sonner';
import { CV } from '@/lib/types/cv-types';

export const useCvAutoSave = (intervalMs: number = 30000) => {
    const cv = useCvEditorState((state) => state.cv);
    const originalCv = useCvEditorState((state) => state.originalCv);
    const setAutoSaving = useCvEditorState((state) => state.setAutoSaving);

    const updateCv = useUpdateCv();
    const cvRef = useRef(cv);

    // Keep ref updated with latest CV state
    useEffect(() => {
        cvRef.current = cv;
    }, [cv]);

    useEffect(() => {
        const timer = setInterval(() => {
            const currentCv = cvRef.current;

            // Only autosave if CV exists and has an ID
            if (!currentCv || !('id' in currentCv)) return;

            // Skip if no changes
            if (JSON.stringify(currentCv) === JSON.stringify(originalCv))
                return;

            setAutoSaving(true);
            updateCv.mutate(currentCv as CV, {
                onSuccess: () => {
                    setAutoSaving(false);
                    toast('CV autosaved');
                },
                onError: () => {
                    setAutoSaving(false);
                },
            });
        }, intervalMs);

        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [intervalMs]);
};
