import { Billet } from '@/lib/types/ingot-types';
import { Button } from '@/components/shadcn-components/button';
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
} from '@/components/shadcn-components/alert-dialog';
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
            'Untitled Billet'
        );
    };

    return (
        <div
            className={`group p-3 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-500 transition-colors flex gap-3 items-start ${
                isEditing ? 'ring-1 ring-forge-orange border-forge-orange' : ''
            }`}
        >
            <div className="flex-1 min-w-0">
                <h5 className="text-slate-200 text-sm font-medium truncate">
                    {getDisplayName(billet)}
                </h5>
                <p className="text-slate-500 text-xs truncate mt-0.5">
                    {billet.type.replace('billet_', '').replace(/_/g, ' ')}
                </p>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-slate-400 hover:text-white"
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
                            className="h-6 w-6 p-0 text-slate-500 hover:text-red-400"
                            disabled={isDisabled}
                        >
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-slate-800 border-slate-700 text-slate-100">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Billet?</AlertDialogTitle>
                            <AlertDialogDescription className="text-slate-400">
                                This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="bg-slate-700 text-slate-200 hover:bg-slate-600 border-none">
                                Cancel
                            </AlertDialogCancel>
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
