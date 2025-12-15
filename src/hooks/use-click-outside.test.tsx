import { render, screen, fireEvent } from '@testing-library/react';
import { useClickOutside } from './use-click-outside';
import { useRef } from 'react';

const TestComponent = ({
    callback,
    hasExclude = false,
}: {
    callback: () => void;
    hasExclude?: boolean;
}) => {
    const excludeRef = useRef<HTMLDivElement>(null);
    // We cast the ref here because the hook expects a generic HTMLElement ref,
    // but we are using a specific HTMLDivElement ref.
    const ref = useClickOutside<HTMLDivElement>(
        callback,
        hasExclude ? [excludeRef as React.RefObject<HTMLElement>] : []
    );

    return (
        <div>
            <div data-testid="outside">Outside</div>
            <div ref={ref} data-testid="inside">
                Inside
            </div>
            {hasExclude && (
                <div ref={excludeRef} data-testid="exclude">
                    Exclude
                </div>
            )}
        </div>
    );
};

describe('useClickOutside', () => {
    it('calls callback when clicking outside', () => {
        const callback = jest.fn();
        render(<TestComponent callback={callback} />);

        // Simulate a click on an element outside the ref
        fireEvent.mouseDown(screen.getByTestId('outside'));
        expect(callback).toHaveBeenCalled();
    });

    it('does not call callback when clicking inside', () => {
        const callback = jest.fn();
        render(<TestComponent callback={callback} />);

        // Simulate a click on the element with the ref
        fireEvent.mouseDown(screen.getByTestId('inside'));
        expect(callback).not.toHaveBeenCalled();
    });

    it('does not call callback when clicking excluded element', () => {
        const callback = jest.fn();
        render(<TestComponent callback={callback} hasExclude={true} />);

        // Simulate a click on an element that is in the exclude list
        fireEvent.mouseDown(screen.getByTestId('exclude'));
        expect(callback).not.toHaveBeenCalled();
    });
});
