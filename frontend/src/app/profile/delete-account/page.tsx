'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/ui/shadcn/button';
import { Input } from '@/ui/shadcn/input';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/ui/shadcn/alert-dialog';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { userApi } from '@/lib/api/user';
import {
    SettingsCard,
    SettingsSectionHeader,
} from '@/components/features/profile/settings-card';

export default function DeleteAccountPage() {
    const [confirmString, setConfirmString] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    const handleFinalConfirmation = async () => {
        setIsDeleting(true);
        try {
            await userApi.deleteUserAccount();
            toast.success('Account deleted.');
            router.push('/');
        } catch {
            toast.error('Failed to delete account.');
            setIsDeleting(false);
            setIsModalOpen(false);
        }
    };

    return (
        <SettingsCard className="border-destructive/20">
            <SettingsSectionHeader
                destructive
                title="Delete account"
                description="Permanently delete your account and all data. This cannot be undone."
            />

            <div className="mb-6 rounded-md border border-destructive/20 bg-destructive/5 p-4">
                <div className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                    <p className="text-sm text-destructive/80">
                        This will permanently delete all your ingots, CVs, and
                        settings.
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                <label
                    htmlFor="confirm-delete"
                    className="text-sm font-medium text-ash"
                >
                    Type{' '}
                    <span className="font-mono font-semibold text-text-primary">
                        DELETE
                    </span>{' '}
                    to confirm
                </label>
                <Input
                    id="confirm-delete"
                    value={confirmString}
                    onChange={(e) => setConfirmString(e.target.value)}
                    placeholder="DELETE"
                    className="bg-input-bg border-input-border text-input-text placeholder:text-input-placeholder"
                />
                <Button
                    variant="destructive"
                    disabled={confirmString !== 'DELETE' || isDeleting}
                    onClick={() => setIsModalOpen(true)}
                >
                    Delete account
                </Button>
            </div>

            <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <AlertDialogContent className="bg-gunmetal border-border-emphasis">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                            <AlertTriangle className="h-4 w-4" />
                            Final confirmation
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-ash">
                            Are you sure? All your data will be lost forever.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                void handleFinalConfirmation();
                            }}
                            disabled={isDeleting}
                            className="bg-red-500 hover:bg-red-600 text-white"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Yes, delete everything'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </SettingsCard>
    );
}
