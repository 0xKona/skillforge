import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AvatarDisplayEditor from './avatar-editor';
import { AvatarService } from '@/lib/classes/services/avatar-service';
import { useClientAuth } from '@/lib/store/use-client-auth';
import { toast } from 'sonner';
import React from 'react';

// Mock dependencies
jest.mock('@/lib/classes/services/avatar-service');
jest.mock('@/lib/store/use-client-auth');
jest.mock('sonner', () => ({
    toast: jest.fn(),
}));

describe('AvatarDisplayEditor', () => {
    const mockSetAvatarUrl = jest.fn();
    const mockUpdateUserAvatar = AvatarService.updateUserAvatar as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        (useClientAuth as unknown as jest.Mock).mockReturnValue({
            avatarUrl: 'http://example.com/current-avatar.jpg',
            setAvatarUrl: mockSetAvatarUrl,
        });
    });

    it('renders current avatar', () => {
        render(<AvatarDisplayEditor />);
        const images = screen.getAllByTestId('avatar-image');
        // The first image should be the main avatar
        expect(images[0]).toHaveAttribute(
            'src',
            'http://example.com/current-avatar.jpg'
        );
    });

    it('shows upload overlay on hover', () => {
        render(<AvatarDisplayEditor />);
        expect(screen.getByText('Upload new')).toBeInTheDocument();
    });

    it('opens confirmation dialog when file is selected', () => {
        const { container } = render(<AvatarDisplayEditor />);
        const file = new File(['(⌐□_□)'], 'chucknorris.png', {
            type: 'image/png',
        });
        const input = container.querySelector(
            'input[type="file"]'
        ) as HTMLInputElement;

        fireEvent.change(input, { target: { files: [file] } });

        expect(screen.getByTestId('alert-dialog')).toBeInTheDocument();
    });

    it('handles file selection and opens dialog', () => {
        const { container } = render(<AvatarDisplayEditor />);
        const file = new File(['dummy content'], 'test.png', {
            type: 'image/png',
        });
        const input = container.querySelector(
            'input[type="file"]'
        ) as HTMLInputElement;

        fireEvent.change(input, { target: { files: [file] } });

        expect(screen.getByTestId('alert-dialog')).toBeInTheDocument();
        expect(screen.getByText('Upload New Avatar')).toBeInTheDocument();
    });

    it('cancels upload when cancel is clicked', () => {
        const { container } = render(<AvatarDisplayEditor />);
        const file = new File(['dummy content'], 'test.png', {
            type: 'image/png',
        });
        const input = container.querySelector(
            'input[type="file"]'
        ) as HTMLInputElement;

        fireEvent.change(input, { target: { files: [file] } });

        const cancelButton = screen.getByTestId('cancel-button');
        fireEvent.click(cancelButton);

        expect(screen.queryByTestId('alert-dialog')).not.toBeInTheDocument();
        expect(mockUpdateUserAvatar).not.toHaveBeenCalled();
    });

    it('uploads image when confirmed', async () => {
        const { container } = render(<AvatarDisplayEditor />);
        const file = new File(['dummy content'], 'test.png', {
            type: 'image/png',
        });
        const input = container.querySelector(
            'input[type="file"]'
        ) as HTMLInputElement;
        const newAvatarUrl = 'http://example.com/new-avatar.jpg';

        mockUpdateUserAvatar.mockResolvedValue(newAvatarUrl);

        fireEvent.change(input, { target: { files: [file] } });

        const confirmButton = screen.getByTestId('confirm-button');
        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(mockUpdateUserAvatar).toHaveBeenCalledWith(file);
            expect(mockSetAvatarUrl).toHaveBeenCalledWith(newAvatarUrl);
            expect(toast).toHaveBeenCalledWith(
                'Avatar updated successfully!',
                expect.any(Object)
            );
            expect(
                screen.queryByTestId('alert-dialog')
            ).not.toBeInTheDocument();
        });
    });

    it('handles upload error', async () => {
        const { container } = render(<AvatarDisplayEditor />);
        const file = new File(['dummy content'], 'test.png', {
            type: 'image/png',
        });
        const input = container.querySelector(
            'input[type="file"]'
        ) as HTMLInputElement;
        const consoleSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        mockUpdateUserAvatar.mockRejectedValue(new Error('Upload failed'));

        fireEvent.change(input, { target: { files: [file] } });

        const confirmButton = screen.getByTestId('confirm-button');
        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(mockUpdateUserAvatar).toHaveBeenCalled();
            expect(mockSetAvatarUrl).not.toHaveBeenCalled();
            expect(consoleSpy).toHaveBeenCalledWith(
                'Error updating avatar:',
                expect.any(Error)
            );
        });

        consoleSpy.mockRestore();
    });
});
