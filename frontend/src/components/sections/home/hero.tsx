'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/ui/shadcn/button';
import { DemoCvHero } from '@/components/sections/home/demo-cv-hero';
import { ArrowUpRight } from 'lucide-react';

export function HomeHero() {
    const { isAuthenticated, loading } = useAuth();

    return (
        <section className="flex items-center pt-20 pb-10 md:pt-28 md:pb-14">
            <div className="grid w-full items-center gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:gap-14">
                <div className="max-w-xl">
                    <p className="mb-5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-flux">
                        Modular CV builder
                    </p>
                    <h1 className="font-display text-5xl font-semibold leading-[1.02] tracking-[-0.045em] text-text-primary sm:text-6xl">
                        Your skills.{' '}
                        <span className="text-flux">Arranged.</span>
                    </h1>
                    <p className="mt-6 max-w-md text-base leading-7 text-ash sm:text-lg">
                        Build modular CVs from reusable blocks. Tailor every
                        application without starting over.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center gap-4">
                        <Link href={isAuthenticated ? '/forge' : '/login'}>
                            <Button
                                disabled={loading}
                                aria-busy={loading}
                                className="h-11 rounded-md bg-flux px-5 font-medium text-white shadow-lg shadow-flux/15 transition-colors hover:bg-flux-hover active:scale-[0.98]"
                            >
                                {loading
                                    ? 'Loading…'
                                    : isAuthenticated
                                      ? 'Open the Forge'
                                      : 'Start building'}
                                {!loading && (
                                    <ArrowUpRight className="h-4 w-4" />
                                )}
                            </Button>
                        </Link>
                    </div>
                </div>

                <DemoCvHero />
            </div>
        </section>
    );
}
