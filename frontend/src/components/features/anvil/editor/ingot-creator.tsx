'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { PageContainer } from '@/components/layout/wrappers/page-container';
import { Button } from '@/ui/shadcn/button';
import { mappingHelpers } from '@/lib/helpers/mapping';
import { INGOT_TEMPLATES } from '@/lib/templates/ingot-templates';
import type { IngotType, NewIngot } from '@/lib/types/ingot-types';
import IngotEditor from './ingot-editor';

const emptyIngotContent: NewIngot['content'] = {
    fields: {},
    billetFormat: null,
    billets: [],
};

export function IngotCreator() {
    const [selectedType, setSelectedType] = useState<IngotType | null>(null);

    if (selectedType) {
        const initialIngotData: NewIngot = {
            name: '',
            type: selectedType,
            content: emptyIngotContent,
        };

        return (
            <main className="min-h-[calc(100vh-56px)] bg-graphite">
                <IngotEditor initialIngotData={initialIngotData} />
            </main>
        );
    }

    return (
        <main className="min-h-[calc(100vh-56px)] bg-graphite">
            <PageContainer className="py-8 md:py-12">
                <div className="mx-auto max-w-4xl">
                    <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="-ml-3 mb-8 text-ash hover:bg-transparent hover:text-text-primary"
                    >
                        <Link href="/anvil">
                            <ArrowLeft className="size-4" />
                            Back to ingots
                        </Link>
                    </Button>

                    <div className="max-w-xl">
                        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-flux">
                            New reusable block
                        </p>
                        <h1 className="mt-3 text-balance font-display text-3xl font-semibold tracking-[-0.04em] text-text-primary sm:text-4xl">
                            What are you adding to your library?
                        </h1>
                        <p className="mt-4 text-pretty text-sm leading-6 text-ash sm:text-base">
                            Choose a block type to start with the fields that
                            fit the experience you want to capture.
                        </p>
                    </div>

                    <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {mappingHelpers.getIngotTypeList().map((type) => {
                            const template = INGOT_TEMPLATES[type];
                            const fieldCount = Object.keys(
                                template.content.fields
                            ).length;
                            const hasBillets = !!template.content.billetFormat;

                            return (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setSelectedType(type)}
                                    className="group flex min-h-32 flex-col rounded-lg border border-border-default bg-gunmetal p-5 text-left transition-[border-color,background-color,transform] hover:border-border-warm hover:bg-slag/50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                                >
                                    <span className="font-display text-lg font-medium text-text-primary">
                                        {mappingHelpers.getIngotLabel(type)}
                                    </span>
                                    <span className="mt-2 text-sm text-ash">
                                        {fieldCount} core{' '}
                                        {fieldCount === 1 ? 'field' : 'fields'}
                                        {hasBillets
                                            ? ' · repeatable entries'
                                            : ''}
                                    </span>
                                    <ChevronRight className="mt-auto size-4 self-end text-ash transition-transform group-hover:translate-x-0.5 group-hover:text-flux" />
                                </button>
                            );
                        })}
                    </div>
                </div>
            </PageContainer>
        </main>
    );
}
