'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProfileService } from '@/lib/classes/services/profile-service';
import { Button } from '@/components/ui/component-library/shadcn-components/button';
import { Input } from '@/components/ui/component-library/shadcn-components/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/component-library/shadcn-components/dialog';
import {
    TypographyH3,
    TypographyH4,
    TypographyP,
} from '@/components/ui/typography/typography';
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function DeleteAccount() {
    const [confirmString, setConfirmString] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    const handleInitialDeleteClick = () => {
        if (confirmString === 'DELETE') {
            setIsModalOpen(true);
        }
    };

    const handleFinalConfirmation = async () => {
        setIsDeleting(true);

        try {
            await ProfileService.deleteUserAccount();

            toast.success('Account Deleted', {
                description:
                    'Your account and all data have been permanently deleted.',
            });

            router.push('/');
        } catch (error) {
            console.error('Error deleting account:', error);
            toast.error('Error', {
                description: 'Failed to delete account. Please try again.',
            });
            setIsDeleting(false);
            setIsModalOpen(false);
        }
    };

    return (
        <div className="space-y-8 w-full">
            <div className="space-y-2">
                <TypographyH3 className="text-red-500 flex items-center gap-2">
                    <Trash2 className="h-6 w-6" />
                    Delete Account
                </TypographyH3>
                <TypographyP className="text-slate-400">
                    Permanently delete your account and all associated data.
                    This action cannot be undone.
                </TypographyP>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 space-y-4">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                    <div className="space-y-2">
                        <TypographyH4 className="font-semibold text-red-500">
                            Warning: Irreversible Action
                        </TypographyH4>
                        <TypographyP className="text-sm text-red-500/80 leading-relaxed">
                            This will permanently delete your account, including
                            all your <strong>Ingots</strong>,{' '}
                            <strong>CVs</strong>, and personal settings. You
                            will not be able to recover this data.
                        </TypographyP>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label
                        htmlFor="confirm-delete"
                        className="text-sm font-medium text-slate-300"
                    >
                        Type{' '}
                        <span className="font-mono font-bold text-slate-100">
                            DELETE
                        </span>{' '}
                        to confirm
                    </label>
                    <Input
                        id="confirm-delete"
                        value={confirmString}
                        onChange={(e) => setConfirmString(e.target.value)}
                        placeholder="DELETE"
                        className="bg-slate-900/50 border-slate-800 text-slate-100 placeholder:text-slate-600"
                    />
                </div>

                <Button
                    variant="destructive"
                    className="w-full sm:w-auto"
                    disabled={confirmString !== 'DELETE' || isDeleting}
                    onClick={handleInitialDeleteClick}
                >
                    Delete Account
                </Button>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="bg-slate-900 border-slate-800 text-slate-100">
                    <DialogHeader>
                        <DialogTitle className="text-red-500 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            Final Confirmation
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Are you absolutely sure? This action cannot be
                            undone. All your data will be lost forever.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="ghost"
                            onClick={() => setIsModalOpen(false)}
                            disabled={isDeleting}
                            className="text-slate-300 hover:text-slate-100 hover:bg-slate-800"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleFinalConfirmation}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Yes, Delete Everything'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
