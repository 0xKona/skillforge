import type {
    DocumentItem,
    DocumentSection,
} from '@/lib/types/cv-document-types';

import {
    dateRange,
    EM_DASH,
    hrefForUrl,
    joinComma,
    mailtoHref,
    skillPhrase,
    socialSpan,
    splitDescription,
    telHref,
    trimField,
} from './format';
import type {
    LayoutBlock,
    LayoutHeading,
    LayoutNode,
    SectionLayout,
    TextSpan,
} from './types';

function headingHasContent(heading: LayoutHeading): boolean {
    return Boolean(heading.title || heading.date || heading.subtitle?.text);
}

function makeBlock(
    heading: LayoutHeading,
    body?: LayoutBlock['body']
): LayoutBlock | null {
    if (!headingHasContent(heading) && !body) return null;
    return { type: 'block', ...heading, body };
}

function pushBlock(nodes: LayoutNode[], block: LayoutBlock | null) {
    if (block) nodes.push(block);
}

function personalInfoNodes(section: DocumentSection): LayoutNode[] {
    const item = section.items[0];
    if (!item) return [];

    const name = trimField(item.fields.name);
    const contacts: TextSpan[] = [];

    const email = trimField(item.fields.email);
    if (email) contacts.push({ text: email, href: mailtoHref(email) });

    const phone = trimField(item.fields.phone);
    if (phone) contacts.push({ text: phone, href: telHref(phone) });

    const address = trimField(item.fields.address);
    if (address) contacts.push({ text: address });

    for (const sub of item.subItems ?? []) {
        const span = socialSpan(sub.fields);
        if (span) contacts.push(span);
    }

    if (!name && contacts.length === 0) return [];
    return [{ type: 'header', name, contacts }];
}

function personalStatementNodes(section: DocumentSection): LayoutNode[] {
    const statement = trimField(section.items[0]?.fields.statement);
    if (!statement) return [];
    return [
        {
            type: 'block',
            body: { type: 'paragraph', text: statement },
        },
    ];
}

function experienceNodes(section: DocumentSection): LayoutNode[] {
    const nodes: LayoutNode[] = [];

    for (const item of section.items) {
        const company = trimField(item.fields.companyName);
        const location = trimField(item.fields.location);
        const companyDates = dateRange(
            item.fields.startDate,
            item.fields.endDate
        );
        const companyLine = joinComma(company, location);

        const roles = (item.subItems ?? [])
            .map((role) => ({
                title: trimField(role.fields.jobTitle),
                date:
                    dateRange(role.fields.startDate, role.fields.endDate) ||
                    companyDates,
                body: splitDescription(role.fields.jobDescription),
            }))
            .filter((role) => role.title || role.body);

        if (roles.length >= 2) {
            const children = roles
                .map((role) =>
                    makeBlock(
                        {
                            title: role.title || undefined,
                            date: role.date || undefined,
                        },
                        role.body
                    )
                )
                .filter((block): block is LayoutBlock => block !== null);

            if (
                !headingHasContent({ title: companyLine || undefined }) &&
                children.length === 0
            ) {
                continue;
            }

            nodes.push({
                type: 'group',
                heading: { title: companyLine || undefined },
                children,
            });
            continue;
        }

        if (roles.length === 1) {
            const role = roles[0];
            const title = role.title || company;
            const subtitleText = role.title ? companyLine : location;
            pushBlock(
                nodes,
                makeBlock(
                    {
                        title: title || undefined,
                        date: role.date || undefined,
                        subtitle: subtitleText
                            ? { text: subtitleText }
                            : undefined,
                    },
                    role.body
                )
            );
            continue;
        }

        pushBlock(
            nodes,
            makeBlock({
                title: company || undefined,
                date: companyDates || undefined,
                subtitle: location ? { text: location } : undefined,
            })
        );
    }

    return nodes;
}

function educationSubjectBullets(item: DocumentItem): string[] {
    const bullets: string[] = [];

    for (const sub of item.subItems ?? []) {
        const name = trimField(sub.fields.name);
        const grade = trimField(sub.fields.grade);
        const head = name
            ? grade
                ? `${name} (${grade})`
                : name
            : grade
              ? `(${grade})`
              : '';
        if (head) bullets.push(head);

        const description = splitDescription(sub.fields.description);
        if (!description) continue;
        if (description.type === 'paragraph') {
            bullets.push(description.text);
        } else {
            bullets.push(...description.items);
        }
    }

    return bullets;
}

function educationNodes(section: DocumentSection): LayoutNode[] {
    const nodes: LayoutNode[] = [];

    for (const item of section.items) {
        const school = trimField(item.fields.schoolName);
        const location = trimField(item.fields.location);
        const qualification = trimField(item.fields.qualificationLevel);
        const dates = dateRange(item.fields.startDate, item.fields.endDate);
        const subjectBullets = educationSubjectBullets(item);

        pushBlock(
            nodes,
            makeBlock(
                {
                    title: joinComma(school, location) || undefined,
                    date: dates || undefined,
                    subtitle: qualification
                        ? { text: qualification }
                        : undefined,
                },
                subjectBullets.length > 0
                    ? { type: 'bullets', items: subjectBullets }
                    : undefined
            )
        );
    }

    return nodes;
}

function skillNodes(section: DocumentSection): LayoutNode[] {
    const nodes: LayoutNode[] = [];

    for (const item of section.items) {
        const group = trimField(item.fields.groupName);
        const skills = (item.subItems ?? [])
            .map((sub) =>
                skillPhrase(sub.fields.skillName, sub.fields.description)
            )
            .filter(Boolean);

        if (group && skills.length > 0) {
            nodes.push({
                type: 'labeledLine',
                label: group,
                value: skills.join(', '),
            });
            continue;
        }

        if (group) {
            pushBlock(nodes, makeBlock({ title: group }));
            continue;
        }

        if (skills.length > 0) {
            pushBlock(
                nodes,
                makeBlock({
                    title: skills.join(', '),
                })
            );
        }
    }

    return nodes;
}

function projectNodes(section: DocumentSection): LayoutNode[] {
    const nodes: LayoutNode[] = [];

    for (const item of section.items) {
        const title = trimField(item.fields.projectTitle);
        const url = trimField(item.fields.projectURL);
        const href = url ? hrefForUrl(url) : undefined;
        const subtitle: TextSpan | undefined = url
            ? href
                ? { text: url, href }
                : { text: url }
            : undefined;

        pushBlock(
            nodes,
            makeBlock(
                { title: title || undefined, subtitle },
                splitDescription(item.fields.projectDescription)
            )
        );
    }

    return nodes;
}

function certificationNodes(section: DocumentSection): LayoutNode[] {
    const nodes: LayoutNode[] = [];

    for (const item of section.items) {
        pushBlock(
            nodes,
            makeBlock(
                {
                    title: trimField(item.fields.certName) || undefined,
                    date: trimField(item.fields.certDate) || undefined,
                },
                splitDescription(item.fields.certDescription)
            )
        );
    }

    return nodes;
}

function hobbyNodes(section: DocumentSection): LayoutNode[] {
    const nodes: LayoutNode[] = [];

    for (const item of section.items) {
        pushBlock(
            nodes,
            makeBlock(
                { title: trimField(item.fields.hobbyName) || undefined },
                splitDescription(item.fields.hobbyDescription)
            )
        );
    }

    return nodes;
}

function referenceNodes(section: DocumentSection): LayoutNode[] {
    const nodes: LayoutNode[] = [];

    for (const item of section.items) {
        const name = trimField(item.fields.referenceName);
        const company = trimField(item.fields.referenceCompany);
        const contact = trimField(item.fields.referenceContact);
        const title = [name, company].filter(Boolean).join(` ${EM_DASH} `);

        pushBlock(
            nodes,
            makeBlock(
                { title: title || undefined },
                contact ? { type: 'paragraph', text: contact } : undefined
            )
        );
    }

    return nodes;
}

function nodesForSection(section: DocumentSection): LayoutNode[] {
    switch (section.type) {
        case 'personal_info':
            return personalInfoNodes(section);
        case 'personal_statement':
            return personalStatementNodes(section);
        case 'experience':
            return experienceNodes(section);
        case 'education':
            return educationNodes(section);
        case 'skill':
            return skillNodes(section);
        case 'project':
            return projectNodes(section);
        case 'certification':
            return certificationNodes(section);
        case 'hobby':
            return hobbyNodes(section);
        case 'reference':
            return referenceNodes(section);
        default:
            return [];
    }
}

export function sectionToLayout(
    section: DocumentSection
): SectionLayout | null {
    const nodes = nodesForSection(section);
    if (nodes.length === 0) return null;

    return {
        title: section.type === 'personal_info' ? null : section.title,
        nodes,
    };
}
