'use client';

import { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import {
    ACTION_VERB_CATEGORIES,
    WEAK_PHRASES,
} from '@/lib/constants/bullet-assistant';

interface BulletAssistantProps {
    onInsertVerb: (verb: string) => void;
    currentText?: string;
}

export function BulletAssistant({
    onInsertVerb,
    currentText,
}: BulletAssistantProps) {
    const [open, setOpen] = useState(false);

    // Detect weak phrases in currentText
    const detectedWeak = currentText
        ? WEAK_PHRASES.find((p) => currentText.toLowerCase().includes(p.weak))
        : null;

    return (
        <div className="mt-1">
            <div className="flex items-center justify-between gap-2">
                {detectedWeak ? (
                    <span className="truncate text-[10px] text-amber-400">
                        Tip: Replace &ldquo;{detectedWeak.weak}&rdquo; with an
                        active verb ({detectedWeak.suggestion})
                    </span>
                ) : (
                    <span />
                )}
                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className="inline-flex shrink-0 items-center gap-1 text-[10px] font-medium text-ash transition-colors hover:text-flux"
                >
                    <Sparkles className="h-2.5 w-2.5 text-flux" />
                    <span>XYZ Formula</span>
                    {open ? (
                        <ChevronUp className="h-2.5 w-2.5" />
                    ) : (
                        <ChevronDown className="h-2.5 w-2.5" />
                    )}
                </button>
            </div>

            {open && (
                <div className="mt-1.5 space-y-2 rounded border border-border-default bg-crucible/95 p-2 text-xs">
                    <p className="text-[10px] text-ash">
                        <strong className="text-text-primary">
                            Google XYZ Formula:
                        </strong>{' '}
                        Accomplished [X], measured by [Y], by doing [Z].
                    </p>
                    <div className="space-y-1.5">
                        {ACTION_VERB_CATEGORIES.map((cat) => (
                            <div key={cat.label}>
                                <span className="font-mono text-[9px] uppercase tracking-wider text-ash/70">
                                    {cat.label}
                                </span>
                                <div className="mt-0.5 flex flex-wrap gap-1">
                                    {cat.verbs.map((verb) => (
                                        <button
                                            key={verb}
                                            type="button"
                                            onClick={() => onInsertVerb(verb)}
                                            className="rounded bg-graphite px-1.5 py-0.5 font-mono text-[10px] text-ash transition-colors hover:bg-flux hover:text-white"
                                        >
                                            +{verb}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
