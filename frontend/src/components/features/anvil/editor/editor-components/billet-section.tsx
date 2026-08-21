import BilletEditor from '../billet-editor';
import { Billet } from '@/lib/types/ingot-types';

interface BilletSectionProps {
    billets: Billet[];
    activeType: string;
    onChange: (billets: Billet[]) => void;
}

export function BilletSection({
    billets,
    activeType,
    onChange,
}: BilletSectionProps) {
    return (
        <BilletEditor
            billets={billets}
            activeType={activeType}
            onChange={onChange}
        />
    );
}
