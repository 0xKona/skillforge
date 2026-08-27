'use client';

import Link from 'next/link';
import type { Ingot } from '@/lib/types/ingot-types';
import { mappingHelpers } from '@/lib/helpers/mapping';

interface IngotCardProps {
    ingot: Ingot;
}

export function IngotCard({ ingot }: IngotCardProps) {
    const billetCount = ingot.content.billets.length;
    const typeLabel = mappingHelpers.getIngotLabel(
        ingot.type as Parameters<typeof mappingHelpers.getIngotLabel>[0]
    );

    return (
        <Link href={`/anvil/edit/${ingot.id}`}>
            <div className="rounded-lg border border-border-default bg-gunmetal p-4 transition-colors duration-150 hover:border-border-warm cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                    <span className="h-2 w-2 rounded-full bg-flux" />
                    <span className="font-mono text-xs text-ash">
                        {typeLabel}
                    </span>
                </div>
                <h3 className="text-base font-semibold text-text-primary truncate">
                    {ingot.name}
                </h3>
                <span className="mt-2 inline-block font-mono text-xs text-ash">
                    {billetCount} {billetCount === 1 ? 'billet' : 'billets'}
                </span>
            </div>
        </Link>
    );
}
