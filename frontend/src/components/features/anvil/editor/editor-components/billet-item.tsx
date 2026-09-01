import { Billet } from '@/lib/types/ingot-types';
import { billetHelpers } from '@/lib/helpers/billet';
import { TypographyP } from '@/ui/typography/typography';
import { Button } from '@/ui/shadcn/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/ui/shadcn/alert-dialog';
import { Trash2, Edit2 } from 'lucide-react';

interface BilletItemProps {
    billet: Billet;
    isEditing: boolean;
    isDisabled: boolean;
    onEdit: (billet: Billet) => void;
    onDelete: (id: string) => void;
}

export function BilletItem({
    billet,
    isEditing,
    isDisabled,
    onEdit,
    onDelete,
}: BilletItemProps) {
    // Helper to get a display name from common fields
    const getDisplayName = (billet: Billet) => {
        const fields = billet.fields;
        return (
            (fields.name?.value as string) ||
            (fields.jobTitle?.value as string) ||
            (fields.projectName?.value as string) ||
            (fields.certName?.value as string) ||
            (fields.platform?.value as string) ||
            (fields.skillName?.value as string) ||
            'Untitled Entry'
        );
    };

    return (
        <div
            className={`group p-3 rounded-lg bg-graphite border border-border-default hover:border-border-warm transition-colors flex gap-3 items-start ${
                isEditing ? 'ring-1 ring-flux border-flux' : ''
            }`}
        >
            <div className="flex-1 min-w-0">
                <h5 className="text-sm font-medium truncate text-text-primary">
                    {getDisplayName(billet)}
                </h5>
                <TypographyP className="text-xs truncate mt-0.5 text-ash">
                    {billetHelpers.getBilletLabel(billet)}
                </TypographyP>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-ash hover:text-text-primary"
                    onClick={() => onEdit(billet)}
                    disabled={isDisabled}
                >
                    <Edit2 className="h-3 w-3" />
                </Button>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-ash hover:text-red-400"
                            disabled={isDisabled}
                        >
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Remove Entry?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => onDelete(billet.id)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}
