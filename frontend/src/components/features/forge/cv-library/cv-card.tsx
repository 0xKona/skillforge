'use client';

import Link from 'next/link';
import type { CvDocument } from '@/lib/types/cv-document-types';
import { formatRelativeDate } from '@/lib/utils/format-date';

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
