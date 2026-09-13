import type { CvDocument } from '../types/cv-document-types';
import { cvPreviewHelpers } from './cv-preview';
import { sectionToLayout } from '../cv-layout';

/**
 * Converts a CV document into clean, structured plain text.
 * Optimized for Applicant Tracking Systems (ATS) and text-only job application inputs.
 */
export function generateAtsPlainText(doc: CvDocument): string {
    const lines: string[] = [];
    const visible = cvPreviewHelpers.visibleSections(doc);

    for (const section of visible) {
        const layout = sectionToLayout(section);
        if (!layout || layout.nodes.length === 0) continue;

        if (section.type === 'personal_info') {
            for (const node of layout.nodes) {
                if (node.type === 'header') {
                    if (node.name) lines.push(node.name.toUpperCase());
                    const contacts = node.contacts
                        .map((c) => c.text)
                        .filter(Boolean);
                    if (contacts.length > 0) {
                        lines.push(contacts.join(' | '));
                    }
                    lines.push('');
                }
            }
            continue;
        }

        // Section Title
        if (section.title) {
            lines.push(section.title.toUpperCase());
            lines.push('----------------------------------------');
        }

        for (const node of layout.nodes) {
            if (node.type === 'block') {
                const parts: string[] = [];
                if (node.title) parts.push(node.title);
                if (node.subtitle?.text) parts.push(node.subtitle.text);
                if (node.date) parts.push(`(${node.date})`);

                if (parts.length > 0) {
                    lines.push(parts.join(' - '));
                }

                if (node.body) {
                    if (node.body.type === 'paragraph') {
                        lines.push(node.body.text);
                    } else if (node.body.type === 'bullets') {
                        for (const bullet of node.body.items) {
                            lines.push(`• ${bullet}`);
                        }
                    }
                }
                lines.push('');
            } else if (node.type === 'group') {
                const groupParts: string[] = [];
                if (node.heading.title) groupParts.push(node.heading.title);
                if (node.heading.subtitle?.text)
                    groupParts.push(node.heading.subtitle.text);
                if (node.heading.date)
                    groupParts.push(`(${node.heading.date})`);

                if (groupParts.length > 0) {
                    lines.push(groupParts.join(' - '));
                }

                for (const sub of node.children) {
                    const subParts: string[] = [];
                    if (sub.title) subParts.push(sub.title);
                    if (sub.date) subParts.push(`(${sub.date})`);
                    if (subParts.length > 0)
                        lines.push(`  ${subParts.join(' - ')}`);

                    if (sub.body) {
                        if (sub.body.type === 'paragraph') {
                            lines.push(`  ${sub.body.text}`);
                        } else if (sub.body.type === 'bullets') {
                            for (const b of sub.body.items) {
                                lines.push(`  • ${b}`);
                            }
                        }
                    }
                }
                lines.push('');
            } else if (node.type === 'labeledLine') {
                lines.push(`${node.label}: ${node.value}`);
            }
        }
        lines.push('');
    }

    return lines
        .join('\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}
