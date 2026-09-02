'use client';

import { useState } from 'react';
import { Check, Circle } from 'lucide-react';
import { IngotEditorData } from '@/lib/types/ingot-types';
import { billetHelpers } from '@/lib/helpers/billet';
import { IngotCvPreview } from './ingot-cv-preview';

interface Props {
    ingotData: IngotEditorData;
}

export default function IngotCvPreviewPanel({ ingotData }: Props) {
    const billets = ingotData.content.billets;

    const [selectedBilletIds, setSelectedBilletIds] = useState<Set<string>>(
        () => new Set(billets.map((b) => b.id))
    );

    const toggleBillet = (id: string) => {
        const newSet = new Set(selectedBilletIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedBilletIds(newSet);
    };

    const visibleBillets = billets.filter((b) => selectedBilletIds.has(b.id));
    const allSelected = selectedBilletIds.size === billets.length;

    return (
        <div className="overflow-hidden rounded-lg border border-border-emphasis bg-graphite">
            {/* Panel header */}
            <div className="flex items-center justify-between border-b border-border-default px-3 py-2">
                <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-ash">
                    Preview
                </span>
                {billets.length > 0 && (
                    <span className="text-xs text-ash">
                        {selectedBilletIds.size}/{billets.length} entries shown
                    </span>
                )}
            </div>

            <div className="flex flex-col md:flex-row">
                {/* Entry toggles */}
                {billets.length > 0 && (
                    <div className="flex-none border-b border-border-default bg-crucible/40 p-3 md:w-64 md:border-b-0 md:border-r">
                        <div className="mb-2 flex items-center justify-between">
                            <span className="text-[11px] font-medium uppercase tracking-wider text-ash">
                                Entries
                            </span>
                            {billets.length > 1 && (
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelectedBilletIds(
                                                new Set(
                                                    billets.map((b) => b.id)
                                                )
                                            )
                                        }
                                        disabled={allSelected}
                                        className="rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-ash transition-colors hover:text-flux disabled:cursor-default disabled:text-flux"
                                    >
                                        All
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelectedBilletIds(new Set())
                                        }
                                        disabled={selectedBilletIds.size === 0}
                                        className="rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-ash transition-colors hover:text-flux disabled:cursor-default disabled:opacity-50"
                                    >
                                        None
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col gap-1.5">
                            {billets.map((billet) => {
                                const isSelected = selectedBilletIds.has(
                                    billet.id
                                );
                                return (
                                    <button
                                        key={billet.id}
                                        type="button"
                                        aria-pressed={isSelected}
                                        onClick={() => toggleBillet(billet.id)}
                                        className={`flex w-full items-center gap-2 rounded-md border px-2.5 py-2 text-left text-sm transition-colors cursor-pointer select-none ${
                                            isSelected
                                                ? 'border-flux/40 bg-flux/10 text-text-primary'
                                                : 'border-border-default text-ash hover:border-border-warm hover:text-text-primary'
                                        }`}
                                    >
                                        {isSelected ? (
                                            <Check className="h-4 w-4 shrink-0 text-flux" />
                                        ) : (
                                            <Circle className="h-4 w-4 shrink-0 text-ash" />
                                        )}
                                        <span className="min-w-0 flex-1 truncate font-medium">
                                            {billetHelpers.getBilletDisplayName(
                                                billet
                                            )}
                                        </span>
                                        <span className="shrink-0 text-[10px] text-ash">
                                            {billetHelpers.getBilletLabel(
                                                billet
                                            )}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* CV sheet — fills the remaining width of the row */}
                <div className="flex-1 bg-crucible/60 p-0 sm:p-2">
                    <div className="mx-auto w-full max-w-[840px] overflow-hidden rounded-sm bg-white shadow-lg">
                        <IngotCvPreview
                            ingotData={ingotData}
                            billets={visibleBillets}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
