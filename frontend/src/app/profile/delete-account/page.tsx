'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/ui/shadcn/button';
import { Input } from '@/ui/shadcn/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/ui/shadcn/dialog';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { userApi } from '@/lib/api/user';

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
        <div className="space-y-6 max-w-md">
            <div>
                <h2 className="text-lg font-semibold text-destructive">
                    Delete account
                </h2>
                <p className="text-sm text-ash">
                    Permanently delete your account and all data. This cannot be
                    undone.
                </p>
            </div>

            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 space-y-2">
                <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
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

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="bg-gunmetal border-border-emphasis">
                    <DialogHeader>
                        <DialogTitle className="text-destructive flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Final confirmation
                        </DialogTitle>
                        <DialogDescription className="text-ash">
                            Are you sure? All your data will be lost forever.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => setIsModalOpen(false)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleFinalConfirmation}
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Yes, delete everything'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
