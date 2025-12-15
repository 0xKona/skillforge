import { render, screen } from '@testing-library/react';
import { BilletList } from './billet-list';

jest.mock('./billet-item', () => ({
    BilletItem: ({ billet }: { billet: { id: string } }) => (
        <div data-testid="billet-item">{billet.id}</div>
    ),
}));

describe('BilletList', () => {
    it('renders empty state', () => {
        render(
            <BilletList
                billets={[]}
                editingId={null}
                isAdding={false}
                onEdit={jest.fn()}
                onDelete={jest.fn()}
            />
        );
        expect(screen.getByText('No billets added yet.')).toBeInTheDocument();
    });

    it('renders list', () => {
        render(
            <BilletList
                billets={[{ id: '1', type: 'test', fields: {} }]}
                editingId={null}
                isAdding={false}
                onEdit={jest.fn()}
                onDelete={jest.fn()}
            />
        );
        expect(screen.getByTestId('billet-item')).toBeInTheDocument();
    });
});
