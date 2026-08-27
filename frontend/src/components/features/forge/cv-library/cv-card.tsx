'use client';

import Link from 'next/link';
import type { CvDocument } from '@/lib/types/cv-document-types';

interface CvCardProps {
    cv: CvDocument;
}

export function CvCard({ cv }: CvCardProps) {
    const sectionCount = cv.content.sections.length;
    const lastEdited = formatRelativeDate(cv.updatedAt);

    return (
        <Link href={`/forge/cv/${cv.id}`}>
            <div className="rounded-lg border border-border-default bg-gunmetal p-4 transition-colors duration-150 hover:border-border-warm cursor-pointer">
                <h3 className="text-base font-semibold text-text-primary truncate">
                    {cv.title}
                </h3>
                <div className="mt-2 flex items-center gap-3">
                    <span className="font-mono text-xs text-ash">
                        {lastEdited}
                    </span>
                    <span className="rounded-full bg-slag px-2 py-0.5 font-mono text-xs text-ash">
                        {sectionCount}{' '}
                        {sectionCount === 1 ? 'section' : 'sections'}
                    </span>
                </div>
            </div>
        </Link>
    );
}

function formatRelativeDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Edited today';
    if (diffDays === 1) return 'Edited yesterday';
    if (diffDays < 30) return `Edited ${diffDays} days ago`;
    return `Edited ${date.toLocaleDateString()}`;
}
