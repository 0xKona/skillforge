'use client';

import { useMemo } from 'react';
import { PreviewData } from '@/hooks/use-cv-preview-data';
import { previewStyles } from './styles';
import { getCvFontOption } from '@/lib/pdf/font-options';
import {
    PreviewCertifications,
    PreviewEducation,
    PreviewExperience,
    PreviewGeneric,
    PreviewPersonalInfo,
    PreviewPersonalStatement,
    PreviewProjects,
    PreviewSkills,
} from './sections';

interface Props {
    data: PreviewData | null;
}

export function CvPreviewSheet({ data }: Props) {
    const sections = useMemo(() => data?.sections ?? [], [data]);

    if (!data) return null;

    return (
        <div className={previewStyles.sheet}>
            <div
                className={previewStyles.sheetInner}
                style={{
                    fontFamily: getCvFontOption(data.fontFamily).cssFamily,
                }}
            >
                {sections.length === 0 ? (
                    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
                        <p className="text-[12pt] font-medium text-black/70">
                            {data.title || 'Untitled CV'}
                        </p>
                        <p className="mt-2 text-[10pt] text-black/50">
                            Add your first section to see the preview.
                        </p>
                    </div>
                ) : (
                    sections.map((s) => (
                        <PreviewSection key={s.id} section={s} />
                    ))
                )}
            </div>
        </div>
    );
}

function PreviewSection({
    section,
}: {
    section: PreviewData['sections'][number];
}) {
    const showTitle = section.type !== 'personal_info';
    return (
        <section className="first:mt-0">
            {showTitle && (
                <h2 className={previewStyles.sectionTitle}>{section.title}</h2>
            )}
            <SectionContent section={section.section} />
        </section>
    );
}

function SectionContent({
    section,
}: {
    section: PreviewData['sections'][number]['section'];
}) {
    switch (section.type) {
        case 'personal_info':
            return <PreviewPersonalInfo section={section} />;
        case 'personal_statement':
            return <PreviewPersonalStatement section={section} />;
        case 'experience':
            return <PreviewExperience section={section} />;
        case 'education':
            return <PreviewEducation section={section} />;
        case 'skill':
            return <PreviewSkills section={section} />;
        case 'certification':
            return <PreviewCertifications section={section} />;
        case 'project':
            return <PreviewProjects section={section} />;
        case 'hobby':
        case 'reference':
        default:
            return <PreviewGeneric section={section} />;
    }
}
