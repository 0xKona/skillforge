import { fireEvent, render, screen } from '@testing-library/react';
import { IngotCreator } from './ingot-creator';

jest.mock('./ingot-editor', () => ({
    __esModule: true,
    default: ({
        initialIngotData,
    }: {
        initialIngotData: { type: string; name: string; content: unknown };
    }) => (
        <div
            data-testid="ingot-editor"
            data-type={initialIngotData.type}
            data-name={initialIngotData.name}
        />
    ),
}));

describe('IngotCreator', () => {
    it('shows every supported ingot type', () => {
        render(<IngotCreator />);

        expect(screen.getByRole('button', { name: /^Skill/ })).toBeVisible();
        expect(
            screen.getByRole('button', { name: /^Experience/ })
        ).toBeVisible();
        expect(
            screen.getByRole('link', { name: 'Back to ingots' })
        ).toHaveAttribute('href', '/anvil');
    });

    it('opens the editor with a selected type', () => {
        render(<IngotCreator />);

        fireEvent.click(screen.getByRole('button', { name: /^Skill/ }));

        expect(screen.getByTestId('ingot-editor')).toHaveAttribute(
            'data-type',
            'ingot_skill'
        );
        expect(screen.getByTestId('ingot-editor')).toHaveAttribute(
            'data-name',
            ''
        );
    });
});
