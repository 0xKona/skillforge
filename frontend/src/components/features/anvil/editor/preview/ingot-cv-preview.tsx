'use client';

import type {
    Billet,
    IngotEditorData,
    IngotField,
} from '@/lib/types/ingot-types';
import { mappingHelpers } from '@/lib/helpers/mapping';

interface IngotCvPreviewProps {
    ingotData: IngotEditorData;
    billets: Billet[];
}

// -- Heuristics for a clean, CV-like layout --
// Mirrors the field-key conventions used across the app (see billet-item.tsx,
// ingot-preview-modal.tsx, cv-constants.ts).

const NAME_KEYS = [
    'name',
    'companyName',
    'schoolName',
    'projectTitle',
    'certName',
    'hobbyName',
    'referenceName',
    'groupName',
    'jobTitle',
    'skillName',
];

const DATE_KEYS = ['startDate', 'endDate', 'certDate', 'dateAcquired'];

const DESC_KEYS = [
    'statement',
    'description',
    'jobDescription',
    'projectDescription',
    'hobbyDescription',
    'certDescription',
    'referenceCompany',
    'referenceContact',
    'grade',
];

const HEADING_KEY: Record<string, string | undefined> = {
    ingot_personal_statement: 'title',
    ingot_project: 'projectTitle',
    ingot_certification: 'certName',
    ingot_hobby: 'hobbyName',
    ingot_reference: 'referenceName',
};

function getFieldValue(field: IngotField | undefined): string {
    return field?.value ? String(field.value) : '';
}

function isNameKey(key: string): boolean {
    return NAME_KEYS.includes(key);
}

function isDateKey(key: string): boolean {
    return DATE_KEYS.includes(key);
}

function isDescKey(key: string): boolean {
    return DESC_KEYS.includes(key);
}

// -- Paper primitives (hero preview anatomy, set in the CV default font) --

function SectionRule({ title }: { title: string }) {
    return (
        <div className="mb-2 border-b border-black/70 pb-0.5">
            <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-black">
                {title}
            </span>
        </div>
    );
}

function Bullet({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex gap-1.5 leading-tight">
            <span className="mt-px shrink-0 text-[9px] text-black">•</span>
            <span className="text-[9px] text-black/80">{children}</span>
        </div>
    );
}

function HeaderRow({
    title,
    dateRange,
}: {
    title: string;
    dateRange?: string;
}) {
    return (
        <div className="flex items-baseline justify-between gap-3">
            <span className="text-[9px] font-bold text-black">{title}</span>
            {dateRange ? (
                <span className="shrink-0 text-[8.5px] text-black/60">
                    {dateRange}
                </span>
            ) : null}
        </div>
    );
}

// -- Field renderers --

function renderDateRange(fields: Record<string, IngotField>): string {
    const start = getFieldValue(fields.startDate);
    const end = getFieldValue(fields.endDate);
    if (!start && !end) return '';
    return [start, end].filter(Boolean).join(' \u2013 ');
}

function renderBullets(fields: Record<string, IngotField>, keys: string[]) {
    return keys.map((key) => {
        const value = getFieldValue(fields[key]);
        if (!value) return null;
        return <Bullet key={key}>{value}</Bullet>;
    });
}

// -- Section handlers --

function PersonalInfoBlock({
    ingotData,
    billets,
}: {
    ingotData: IngotEditorData;
    billets: Billet[];
}) {
    const fields = ingotData.content.fields;
    const name = getFieldValue(fields.name);
    const contact = [
        getFieldValue(fields.email),
        getFieldValue(fields.phone),
        getFieldValue(fields.address),
    ].filter(Boolean);

    const socials = billets.map((billet) => {
        const platform = getFieldValue(billet.fields.platform);
        const handle = getFieldValue(billet.fields.handle);
        const url = getFieldValue(billet.fields.url);
        if (url) return `${platform}: ${url}`;
        if (handle) return `${platform}: ${handle}`;
        return platform;
    });

    const headerContact = [...contact, ...socials.filter(Boolean)].join(' | ');

    return (
        <div className="flex flex-col items-center gap-1 pb-1 text-center">
            <p className="text-[15px] font-bold uppercase tracking-[0.18em] text-black">
                {name || 'Untitled'}
            </p>
            {headerContact && (
                <p className="max-w-full break-words text-[8.5px] text-black/60">
                    {headerContact}
                </p>
            )}
        </div>
    );
}

function BilletEntry({ billet }: { billet: Billet }) {
    const fields = billet.fields;
    const title =
        getFieldValue(fields.jobTitle) ||
        getFieldValue(fields.skillName) ||
        getFieldValue(fields.name) ||
        getFieldValue(fields.platform) ||
        getFieldValue(fields.certName) ||
        getFieldValue(fields.projectName) ||
        'Untitled Entry';

    const descKeys = Object.keys(fields).filter(
        (key) => isDescKey(key) && getFieldValue(fields[key])
    );
    const miscKeys = Object.keys(fields).filter(
        (key) =>
            !isNameKey(key) &&
            !isDateKey(key) &&
            !isDescKey(key) &&
            getFieldValue(fields[key])
    );

    const dateRange = renderDateRange(fields);

    return (
        <div className="flex flex-col gap-0.5">
            <HeaderRow title={title} dateRange={dateRange} />
            {miscKeys.map((key) => (
                <p key={key} className="text-[8.5px] italic text-black/50">
                    {getFieldValue(fields[key])}
                </p>
            ))}
            {descKeys.length > 0 && (
                <div className="flex flex-col gap-0.5 pl-2">
                    {renderBullets(fields, descKeys)}
                </div>
            )}
        </div>
    );
}

function GenericNoBilletSection({ ingotData }: { ingotData: IngotEditorData }) {
    const fields = ingotData.content.fields;
    const headingKey = HEADING_KEY[ingotData.type as string] || 'name';
    const heading = getFieldValue(fields[headingKey]);

    const descKeys = Object.keys(fields).filter(
        (key) => isDescKey(key) && getFieldValue(fields[key])
    );
    const miscKeys = Object.keys(fields).filter(
        (key) =>
            !isNameKey(key) &&
            !isDateKey(key) &&
            !isDescKey(key) &&
            getFieldValue(fields[key])
    );

    return (
        <div className="flex flex-col gap-1">
            {heading && (
                <p className="text-[9px] font-bold text-black">{heading}</p>
            )}
            {miscKeys.map((key) => (
                <Bullet key={key}>{getFieldValue(fields[key])}</Bullet>
            ))}
            {descKeys.length > 0 && (
                <div className="flex flex-col gap-0.5 pl-2">
                    {renderBullets(fields, descKeys)}
                </div>
            )}
        </div>
    );
}

// -- Main component --

export function IngotCvPreview({ ingotData, billets }: IngotCvPreviewProps) {
    const type = ingotData.type as string;

    // Personal info renders as a centered header (no section rule).
    if (type === 'ingot_personal_info') {
        return (
            <div className="bg-white font-sans">
                <div className="px-8 py-6">
                    <PersonalInfoBlock
                        ingotData={ingotData}
                        billets={billets}
                    />
                </div>
            </div>
        );
    }

    const sectionTitle =
        type === 'ingot_personal_statement'
            ? 'Personal Statement'
            : mappingHelpers.getIngotLabel(
                  type as Parameters<typeof mappingHelpers.getIngotLabel>[0]
              );

    const fields = ingotData.content.fields;
    const dateRange = renderDateRange(fields);

    // Experience-style ingots: top-level header row carries the dates.
    const topLevelName =
        getFieldValue(fields.companyName) ||
        getFieldValue(fields.schoolName) ||
        getFieldValue(fields.groupName);

    const topLevelMisc = Object.keys(fields).filter(
        (key) =>
            !isNameKey(key) &&
            !isDateKey(key) &&
            !isDescKey(key) &&
            getFieldValue(fields[key])
    );

    return (
        <div className="bg-white font-sans">
            <div className="flex flex-col gap-3 px-8 py-6">
                <SectionRule title={sectionTitle} />

                {type === 'ingot_personal_statement' ? (
                    <GenericNoBilletSection ingotData={ingotData} />
                ) : (
                    <>
                        {topLevelName && (
                            <HeaderRow
                                title={topLevelName}
                                dateRange={dateRange}
                            />
                        )}
                        {topLevelMisc.map((key) => (
                            <p
                                key={key}
                                className="text-[8.5px] italic text-black/50"
                            >
                                {getFieldValue(fields[key])}
                            </p>
                        ))}
                        {billets.length > 0 && (
                            <div className="flex flex-col gap-2">
                                {billets.map((billet) => (
                                    <BilletEntry
                                        key={billet.id}
                                        billet={billet}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
