'use client';

import { mappingHelpers } from '@/lib/helpers/mapping';
import type { IngotType } from '@/lib/types/ingot-types';

interface TypeFilterProps {
    active: string;
    onChange: (type: string) => void;
}

export function TypeFilter({ active, onChange }: TypeFilterProps) {
    const types = mappingHelpers.getIngotTypeList();

    return (
        <div className="flex flex-wrap gap-2">
            <FilterPill
                label="All"
                isActive={active === 'ALL'}
                onClick={() => onChange('ALL')}
            />
            {types.map((type: IngotType) => (
                <FilterPill
                    key={type}
                    label={mappingHelpers.getIngotLabel(type)}
                    isActive={active === type}
                    onClick={() => onChange(type)}
                />
            ))}
        </div>
    );
}

function FilterPill({
    label,
    isActive,
    onClick,
}: {
    label: string;
    isActive: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors duration-150 ${
                isActive
                    ? 'border border-border-hot bg-flux/10 text-flux'
                    : 'border border-border-default bg-gunmetal text-ash hover:text-text-primary'
            }`}
        >
            {label}
        </button>
    );
}
