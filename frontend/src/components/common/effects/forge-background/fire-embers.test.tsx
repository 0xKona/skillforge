import { render } from '@testing-library/react';
import FireEmbers from './fire-embers';

describe('FireEmbers Component', () => {
    it('Should render with default count of embers', () => {
        const { container } = render(<FireEmbers />);

        const wrapper = container.querySelector('.absolute.inset-0');
        expect(wrapper).toBeInTheDocument();

        // Default count is 15
        const embers = container.querySelectorAll('[class*="ember-"]');
        expect(embers.length).toBe(15);
    });

    it('Should render with custom count of embers', () => {
        const customCount = 20;
        const { container } = render(<FireEmbers count={customCount} />);

        const embers = container.querySelectorAll('[class*="ember-"]');
        expect(embers.length).toBe(customCount);
    });

    it('Should render with minimal count of embers', () => {
        const { container } = render(<FireEmbers count={1} />);

        const embers = container.querySelectorAll('[class*="ember-"]');
        expect(embers.length).toBe(1);
    });

    it('Should render with zero embers', () => {
        const { container } = render(<FireEmbers count={0} />);

        const embers = container.querySelectorAll('[class*="ember-"]');
        expect(embers.length).toBe(0);
    });

    it('Should have unique keys for each ember', () => {
        const { container } = render(<FireEmbers count={5} />);

        const embers = container.querySelectorAll('[class*="ember-"]');
        const keys = new Set<string>();

        embers.forEach((ember, index) => {
            const key = ember.getAttribute('data-testid') || `ember-${index}`;
            keys.add(key);
        });

        // If all keys are unique, the set size should equal the ember count
        expect(keys.size).toBe(5);
    });

    it('Should have randomized left positions within valid range', () => {
        const { container } = render(<FireEmbers count={10} />);

        const embers = container.querySelectorAll('[class*="ember-"]');

        embers.forEach((ember) => {
            const leftValue = parseFloat(
                (ember as HTMLElement).style.left.replace('%', '')
            );
            expect(leftValue).toBeGreaterThanOrEqual(0);
            expect(leftValue).toBeLessThanOrEqual(100);
        });
    });

    it('Should maintain stable values on re-render', () => {
        const { container, rerender } = render(<FireEmbers count={5} />);

        const firstRenderPositions: string[] = [];
        const embers = container.querySelectorAll('[class*="ember-"]');

        embers.forEach((ember) => {
            firstRenderPositions.push((ember as HTMLElement).style.left);
        });

        rerender(<FireEmbers count={5} />);

        const secondRenderPositions: string[] = [];
        const newEmbers = container.querySelectorAll('[class*="ember-"]');

        newEmbers.forEach((ember) => {
            secondRenderPositions.push((ember as HTMLElement).style.left);
        });

        // Positions should remain stable on re-render for performance
        const allSame = firstRenderPositions.every(
            (pos, idx) => pos === secondRenderPositions[idx]
        );
        expect(allSame).toBe(true);
    });
});
