import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from './use-is-mobile';

describe('useIsMobile', () => {
    const originalInnerWidth = window.innerWidth;

    beforeAll(() => {
        // Mock window.innerWidth to be writable for testing
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: originalInnerWidth,
        });
    });

    afterAll(() => {
        // Restore original window.innerWidth
        window.innerWidth = originalInnerWidth;
    });

    it('returns true when width is less than breakpoint', () => {
        // Set width to mobile size
        window.innerWidth = 500;
        const { result } = renderHook(() => useIsMobile(768));
        expect(result.current).toBe(true);
    });

    it('returns false when width is greater than breakpoint', () => {
        // Set width to desktop size
        window.innerWidth = 1024;
        const { result } = renderHook(() => useIsMobile(768));
        expect(result.current).toBe(false);
    });

    it('updates on resize', () => {
        // Start with desktop size
        window.innerWidth = 1024;
        const { result } = renderHook(() => useIsMobile(768));
        expect(result.current).toBe(false);

        // Trigger resize event to mobile size
        act(() => {
            window.innerWidth = 500;
            window.dispatchEvent(new Event('resize'));
        });

        expect(result.current).toBe(true);
    });

    it('uses custom breakpoint', () => {
        // Test with a custom breakpoint (e.g. 900px)
        window.innerWidth = 800;
        const { result } = renderHook(() => useIsMobile(900));
        expect(result.current).toBe(true);
    });
});
