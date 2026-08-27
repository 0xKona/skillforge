'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/ui/shadcn/button';

export function HomeHero() {
    const { isAuthenticated, loading } = useAuth();

    return (
        <section className="flex items-center min-h-[70vh] py-16">
            <div className="w-full max-w-[60%]">
                <h1 className="font-display text-5xl font-semibold tracking-tight text-text-primary leading-tight">
                    Your skills. Arranged.
                </h1>
                <p className="mt-4 text-lg text-ash">
                    Build modular CVs from reusable blocks. Tailor every
                    application without starting over.
                </p>
                {!loading && (
                    <div className="mt-8">
                        <Link href={isAuthenticated ? '/forge' : '/login'}>
                            <Button className="h-10 px-6 bg-flux hover:bg-flux-hover text-white font-medium rounded-md transition-colors">
                                {isAuthenticated
                                    ? 'Open the Forge'
                                    : 'Start building'}
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
