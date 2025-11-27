import { AvatarService } from '@/lib/classes/avatar-service';
import React from 'react';
import { toast } from 'sonner';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '../shadcn-components/avatar';
import { CameraIcon } from 'lucide-react';
import { TypographyP } from '../ui/typography/typography';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '../shadcn-components/alert-dialog';
import { useClientAuth } from '@/lib/store/use-client-auth';

export default function AvatarDisplayEditor() {
    const [confirmIsOpen, setConfirmIsOpen] = React.useState(false); // State to control dialog visibility
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null); // State to store the selected file

    const { avatarUrl, setAvatarUrl } = useClientAuth();

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        setSelectedFile(file || null);
        setConfirmIsOpen(!!file); // Open dialog if a file is selected
    }

    async function submitImage() {
        if (selectedFile) {
            console.log('Uploading file:', selectedFile);
            // Add logic to upload the image here
            try {
                const newUrl =
                    await AvatarService.updateUserAvatar(selectedFile);
                toast('Avatar updated successfully!', {
                    description: 'Your avatar has been updated.',
                    action: {
                        label: 'Close',
                        onClick: () => {},
                    },
                });

                setAvatarUrl(newUrl);
                // Set local avatar state with new url
                console.log('Avatar updated successfully:', newUrl);
            } catch (error) {
                console.error('Error updating avatar:', error);
            }
        }
        setConfirmIsOpen(false); // Close the dialog after submission
    }

    return (
        <div className="relative group w-48 h-48 rounded-full border-2">
            <Avatar className="w-full h-full">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback>
                    <AvatarImage
                        src={
                            'https://img.icons8.com/?size=100&id=99268&format=png&color=ffffff'
                        }
                    />
                </AvatarFallback>
            </Avatar>
            {/* Overlay shown on hover */}
            <div
                className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                aria-hidden="true"
            >
                <CameraIcon className="text-white w-6 h-6" />
                <TypographyP className="m-0 p-0">Upload new</TypographyP>
            </div>
            {/* File input */}
            <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileChange}
            />
            {/* Alert Dialog - Only appears on file selection */}
            <AlertDialog open={confirmIsOpen} onOpenChange={setConfirmIsOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Upload New Avatar</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will overwrite your existing avatar, are you
                            sure?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => setConfirmIsOpen(false)}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={submitImage}>
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
