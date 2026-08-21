import { Billet } from '@/lib/types/ingot-types';
import { TypographyP } from '@/ui/typography/typography';
import { BilletItem } from './billet-item';

interface BilletListProps {
    billets: Billet[];
    editingId: string | null;
    isAdding: boolean;
    onEdit: (billet: Billet) => void;
    onDelete: (id: string) => void;
}

export function BilletList({
    billets,
    editingId,
    isAdding,
    onEdit,
    onDelete,
}: BilletListProps) {
    if (billets.length === 0 && !isAdding) {
        return (
            <div className="h-40 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-700/50 rounded-lg">
                <TypographyP className="text-sm">
                    No billets added yet.
                </TypographyP>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {billets.map((billet) => (
                <BilletItem
                    key={billet.id}
                    billet={billet}
                    isEditing={editingId === billet.id}
                    isDisabled={!!editingId || isAdding}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
