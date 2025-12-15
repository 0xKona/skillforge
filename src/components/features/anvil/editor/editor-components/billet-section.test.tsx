import { render, screen } from '@testing-library/react';
import { BilletSection } from './billet-section';

jest.mock('../billet-editor', () => ({
    __esModule: true,
    default: () => <div data-testid="billet-editor">Billet Editor</div>,
}));

describe('BilletSection', () => {
    it('renders BilletEditor', () => {
        render(
            <BilletSection
                billets={[]}
                activeType="test"
                onChange={jest.fn()}
            />
        );
        expect(screen.getByTestId('billet-editor')).toBeInTheDocument();
    });
});
