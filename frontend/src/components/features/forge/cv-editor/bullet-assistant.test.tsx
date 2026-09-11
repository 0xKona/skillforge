import { render, screen, fireEvent } from '@testing-library/react';
import { BulletAssistant } from './bullet-assistant';

describe('BulletAssistant', () => {
    it('detects weak phrases and displays coaching tip', () => {
        render(
            <BulletAssistant
                currentText="I was responsible for managing the production release."
                onInsertVerb={jest.fn()}
            />
        );

        expect(
            screen.getByText(
                /Tip: Replace “responsible for” with an active verb/i
            )
        ).toBeInTheDocument();
    });

    it('expands XYZ formula verbs and invokes callback on click', () => {
        const handleInsert = jest.fn();
        render(
            <BulletAssistant
                currentText="Managed cloud infrastructure"
                onInsertVerb={handleInsert}
            />
        );

        const expandButton = screen.getByRole('button', {
            name: /xyz formula/i,
        });
        fireEvent.click(expandButton);

        expect(screen.getByText(/Google XYZ Formula:/i)).toBeInTheDocument();
        expect(screen.getByText('+Architected')).toBeInTheDocument();

        fireEvent.click(screen.getByText('+Architected'));
        expect(handleInsert).toHaveBeenCalledWith('Architected');
    });
});
