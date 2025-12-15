import { render, screen, fireEvent } from '@testing-library/react';
import BackButton from './back-button';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

describe('BackButton', () => {
    it('renders and navigates back', () => {
        const backMock = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({ back: backMock });

        render(<BackButton />);
        const button = screen.getByRole('button', { name: /back/i });
        expect(button).toBeInTheDocument();

        fireEvent.click(button);
        expect(backMock).toHaveBeenCalled();
    });
});
