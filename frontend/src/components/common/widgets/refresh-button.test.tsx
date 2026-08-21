import { render, screen, fireEvent } from '@testing-library/react';
import { RefreshButton } from './refresh-button';

describe('RefreshButton', () => {
    it('renders and handles click', () => {
        const onClick = jest.fn();
        render(<RefreshButton onClick={onClick} isLoading={false} />);

        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(onClick).toHaveBeenCalled();
    });

    it('shows loading state', () => {
        render(<RefreshButton onClick={jest.fn()} isLoading={true} />);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });
});
