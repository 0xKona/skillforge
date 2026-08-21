import { renderHook } from '@testing-library/react';
import { useCvAutoSave } from './use-cv-auto-save';
import { useCvEditorState } from '@/lib/store/use-cv-editor';
import { toast } from 'sonner';

jest.mock('@/lib/store/use-cv-editor');
jest.mock('sonner', () => ({
    toast: jest.fn(),
}));

describe('useCvAutoSave', () => {
    const mockAutoSaveCv = jest.fn();
    const mockCv = { id: 'cv-1', title: 'Test CV' };
    const mockOriginalCv = { id: 'cv-1', title: 'Original CV' };

    beforeEach(() => {
        jest.clearAllMocks();
        // Use fake timers to control setInterval
        jest.useFakeTimers();
        (useCvEditorState as unknown as jest.Mock).mockReturnValue({
            cv: mockCv,
            originalCv: mockOriginalCv,
            autoSaveCv: mockAutoSaveCv,
        });
    });

    afterEach(() => {
        // Restore real timers after each test to avoid affecting other tests
        jest.useRealTimers();
    });

    it('autosaves when cv has changed', () => {
        renderHook(() => useCvAutoSave(1000));

        // Fast-forward time by 1000ms to trigger the interval
        jest.advanceTimersByTime(1000);

        expect(mockAutoSaveCv).toHaveBeenCalled();
        expect(toast).toHaveBeenCalledWith('Autosaving CV...');
    });

    it('does not autosave when cv has not changed', () => {
        // Mock state where current CV matches original CV
        (useCvEditorState as unknown as jest.Mock).mockReturnValue({
            cv: mockCv,
            originalCv: mockCv, // Same as cv
            autoSaveCv: mockAutoSaveCv,
        });

        renderHook(() => useCvAutoSave(1000));

        jest.advanceTimersByTime(1000);

        expect(mockAutoSaveCv).not.toHaveBeenCalled();
    });

    it('does not autosave when cv is missing id', () => {
        // Mock state where CV is missing an ID (e.g. not yet created/loaded)
        (useCvEditorState as unknown as jest.Mock).mockReturnValue({
            cv: { title: 'No ID' },
            originalCv: { title: 'Original' },
            autoSaveCv: mockAutoSaveCv,
        });

        renderHook(() => useCvAutoSave(1000));

        jest.advanceTimersByTime(1000);

        expect(mockAutoSaveCv).not.toHaveBeenCalled();
    });

    it('clears interval on unmount', () => {
        const { unmount } = renderHook(() => useCvAutoSave(1000));

        // Unmount the hook to trigger cleanup
        unmount();

        // Advance time to ensure the interval doesn't fire after unmount
        jest.advanceTimersByTime(1000);
        expect(mockAutoSaveCv).not.toHaveBeenCalled();
    });
});
