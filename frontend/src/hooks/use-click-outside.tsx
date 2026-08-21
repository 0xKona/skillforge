import { useEffect, useRef } from 'react';

export function useClickOutside<T extends HTMLElement>(
    callback: () => void,
    excludeRefs: React.RefObject<HTMLElement>[] = []
) {
    const ref = useRef<T>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const isOutside =
                !ref.current?.contains(event.target as Node) &&
                excludeRefs.every(
                    (excludeRef) =>
                        !excludeRef.current?.contains(event.target as Node)
                );
            if (isOutside) {
                callback();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [callback, excludeRefs]);

    return ref;
}
