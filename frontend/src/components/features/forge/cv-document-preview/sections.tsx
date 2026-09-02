'use client';

import type { DocumentSection } from '@/lib/types/cv-document-types';
import { previewStyles } from './styles';

function dateRange(start: string, end: string): string {
    if (!start) return '';
    return `${start} – ${end || 'Present'}`;
}

function splitBullets(input: string): string[] {
    return input
        .split('\n')
        .map((l) => l.replace(/^[•\-]\s*/, '').trim())
        .filter(Boolean);
}

export function PreviewPersonalInfo({ section }: { section: DocumentSection }) {
    const item = section.items[0];
    if (!item) return null;

    const { name, email, phone, address } = item.fields;

    const contactItems = [
        email,
        phone,
        address,
        ...(item.subItems ?? []).map((sub) => {
            const platform = sub.fields.platform ?? '';
            const url = sub.fields.url ?? '';
            const handle = sub.fields.handle ?? '';
            if (url) return `${platform ? platform + ': ' : ''}${url}`;
            if (handle) return `${platform ? platform + ': ' : ''}${handle}`;
            return platform;
        }),
    ].filter(Boolean);

    return (
        <div className="mb-5 text-center">
            <h1 className={previewStyles.headerName}>{name}</h1>
            {contactItems.length > 0 && (
                <div className={previewStyles.headerContact}>
                    {contactItems.map((c, i) => (
                        <span key={i} className="flex items-center gap-1">
                            <span>{c}</span>
                            {i < contactItems.length - 1 && (
                                <span className="mx-1 text-black/60">|</span>
                            )}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

export function PreviewPersonalStatement({
    section,
}: {
    section: DocumentSection;
}) {
    const item = section.items[0];
    if (!item) return null;
    const statement = item.fields.statement ?? '';
    if (!statement) return null;
    return <p className={previewStyles.description}>{statement}</p>;
}

export function PreviewExperience({ section }: { section: DocumentSection }) {
    return (
        <div>
            {section.items.map((item) => {
                const { companyName, location, startDate, endDate } =
                    item.fields;
                const dateString = dateRange(startDate, endDate);
                const subItems = item.subItems ?? [];

                if (subItems.length > 0) {
                    return (
                        <div
                            key={item.id}
                            className={previewStyles.sectionBlock}
                        >
                            {subItems.map((sub) => {
                                const title = sub.fields.jobTitle ?? '';
                                const desc = sub.fields.jobDescription ?? '';
                                const bStart = sub.fields.startDate ?? '';
                                const bEnd = sub.fields.endDate ?? '';
                                const bDate = bStart
                                    ? dateRange(bStart, bEnd)
                                    : dateString;
                                const descLines = splitBullets(desc);

                                return (
                                    <div
                                        key={sub.id}
                                        className="mb-3 last:mb-0"
                                    >
                                        <div className={previewStyles.row}>
                                            <div className="min-w-0 flex-1 pr-2">
                                                <span
                                                    className={
                                                        previewStyles.itemTitle
                                                    }
                                                >
                                                    {title}
                                                    {companyName
                                                        ? `, ${companyName}`
                                                        : ''}
                                                </span>
                                            </div>
                                            <div className={previewStyles.date}>
                                                {bDate}
                                            </div>
                                        </div>
                                        {descLines.map((line, i) => (
                                            <div
                                                key={i}
                                                className={previewStyles.bullet}
                                            >
                                                <span
                                                    className={
                                                        previewStyles.bulletDot
                                                    }
                                                >
                                                    •
                                                </span>
                                                <span className="flex-1">
                                                    {line}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                            {location && (
                                <p className={previewStyles.itemSubtitle}>
                                    {location}
                                </p>
                            )}
                        </div>
                    );
                }

                return (
                    <div key={item.id} className={previewStyles.sectionBlock}>
                        <div className={previewStyles.row}>
                            <div className="min-w-0 flex-1 pr-2">
                                <span className={previewStyles.itemTitle}>
                                    {companyName}
                                </span>
                            </div>
                            <div className={previewStyles.date}>
                                {dateString}
                            </div>
                        </div>
                        {location && (
                            <p className={previewStyles.itemSubtitle}>
                                {location}
                            </p>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export function PreviewEducation({ section }: { section: DocumentSection }) {
    return (
        <div>
            {section.items.map((item) => {
                const {
                    schoolName,
                    location,
                    startDate,
                    endDate,
                    qualificationLevel,
                } = item.fields;
                const dateString = dateRange(startDate, endDate);
                const subItems = item.subItems ?? [];

                return (
                    <div key={item.id} className={previewStyles.sectionBlock}>
                        <div className={previewStyles.row}>
                            <div className="min-w-0 flex-1 pr-2">
                                <span className={previewStyles.itemTitle}>
                                    {schoolName}
                                    {qualificationLevel
                                        ? ` — ${qualificationLevel}`
                                        : ''}
                                </span>
                            </div>
                            <div className={previewStyles.date}>
                                {dateString}
                            </div>
                        </div>
                        {location && (
                            <p className={previewStyles.itemSubtitle}>
                                {location}
                            </p>
                        )}
                        {subItems.length > 0 && (
                            <div className="mt-1">
                                {subItems.map((sub) => {
                                    const name = sub.fields.name ?? '';
                                    const grade = sub.fields.grade ?? '';
                                    return (
                                        <div
                                            key={sub.id}
                                            className={previewStyles.bullet}
                                        >
                                            <span
                                                className={
                                                    previewStyles.bulletDot
                                                }
                                            >
                                                •
                                            </span>
                                            <span className="flex-1">
                                                {name}
                                                {grade ? ` (${grade})` : ''}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export function PreviewSkills({ section }: { section: DocumentSection }) {
    return (
        <div>
            {section.items.map((item) => {
                const groupName = item.fields.groupName ?? '';
                const skills = item.subItems ?? [];
                const skillNames = skills
                    .map((s) => s.fields.skillName ?? '')
                    .filter(Boolean)
                    .join(', ');

                return (
                    <div key={item.id} className={previewStyles.sectionBlock}>
                        <p className={previewStyles.itemTitle}>{groupName}</p>
                        {skillNames && (
                            <p className={previewStyles.description}>
                                {skillNames}
                            </p>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export function PreviewCertifications({
    section,
}: {
    section: DocumentSection;
}) {
    return (
        <div>
            {section.items.map((item) => {
                const { certName, certDate, certDescription } = item.fields;
                return (
                    <div key={item.id} className={previewStyles.sectionBlock}>
                        <div className={previewStyles.row}>
                            <div className="min-w-0 flex-1 pr-2">
                                <span className={previewStyles.itemTitle}>
                                    {certName}
                                </span>
                            </div>
                            <div className={previewStyles.date}>{certDate}</div>
                        </div>
                        {certDescription && (
                            <p className={previewStyles.description}>
                                {certDescription}
                            </p>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export function PreviewProjects({ section }: { section: DocumentSection }) {
    return (
        <div>
            {section.items.map((item) => {
                const { projectTitle, projectDescription, projectURL } =
                    item.fields;
                const descLines = splitBullets(projectDescription ?? '');

                return (
                    <div key={item.id} className={previewStyles.sectionBlock}>
                        <p className={previewStyles.itemTitle}>
                            {projectTitle}
                        </p>
                        {projectURL && (
                            <p className={previewStyles.itemSubtitle}>
                                {projectURL}
                            </p>
                        )}
                        {descLines.map((line, i) => (
                            <div key={i} className={previewStyles.bullet}>
                                <span className={previewStyles.bulletDot}>
                                    •
                                </span>
                                <span className="flex-1">{line}</span>
                            </div>
                        ))}
                    </div>
                );
            })}
        </div>
    );
}

export function PreviewGeneric({ section }: { section: DocumentSection }) {
    return (
        <div>
            {section.items.map((item) => {
                const values = Object.values(item.fields).filter(Boolean);
                const primary = values[0] ?? '';
                const secondary = values.slice(1).join(' · ');
                return (
                    <div key={item.id} className={previewStyles.sectionBlock}>
                        <p className={previewStyles.itemTitle}>{primary}</p>
                        {secondary && (
                            <p className={previewStyles.description}>
                                {secondary}
                            </p>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
