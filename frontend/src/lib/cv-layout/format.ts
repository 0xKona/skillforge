import type { LayoutBody, TextSpan } from './types';

export const EN_DASH = '–';
export const EM_DASH = '—';

export function trimField(value: string | undefined | null): string {
    return value?.trim() ?? '';
}

export function dateRange(
    start?: string,
    end?: string,
    fallbackEnd = 'Present'
): string {
    const s = trimField(start);
    const e = trimField(end);
    if (!s && !e) return '';
    if (!s) return e;
    return `${s} ${EN_DASH} ${e || fallbackEnd}`;
}

export function joinComma(...parts: Array<string | undefined | null>): string {
    return parts.map(trimField).filter(Boolean).join(', ');
}

export function splitDescription(
    input: string | undefined | null
): LayoutBody | undefined {
    const raw = (input ?? '')
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
    if (raw.length === 0) return undefined;

    const looksLikeList =
        raw.length > 1 ||
        raw.some((line) => /^[•\-\u2013\u2022]\s+/.test(line));

    const cleaned = raw
        .map((line) => line.replace(/^[•\-\u2013\u2022]\s*/, '').trim())
        .filter(Boolean);
    if (cleaned.length === 0) return undefined;
    if (looksLikeList) return { type: 'bullets', items: cleaned };
    return { type: 'paragraph', text: cleaned[0] };
}

export function skillPhrase(name?: string, detail?: string): string {
    const n = trimField(name);
    if (!n) return '';
    const d = trimField(detail);
    return d ? `${n} (${d})` : n;
}

export function hrefForUrl(
    value: string | undefined | null,
    mode: 'url' | 'maybe' = 'url'
): string | undefined {
    const v = trimField(value);
    if (!v) return undefined;
    if (/^(https?:\/\/|mailto:|tel:)/i.test(v)) return v;
    if (/^www\./i.test(v)) return `https://${v}`;
    if (mode === 'maybe') return undefined;
    if (/\s/.test(v)) return undefined;
    return `https://${v}`;
}

export function mailtoHref(email: string): string {
    return `mailto:${trimField(email)}`;
}

export function telHref(phone: string): string {
    return `tel:${trimField(phone).replace(/[^\d+]/g, '')}`;
}

export function socialSpan(fields: {
    platform?: string;
    handle?: string;
    url?: string;
}): TextSpan | null {
    const platform = trimField(fields.platform);
    const handle = trimField(fields.handle);
    const url = trimField(fields.url);

    if (url) {
        const href = hrefForUrl(url);
        const text = platform ? `${platform}: ${url}` : url;
        return href ? { text, href } : { text };
    }

    if (handle) {
        const text = platform ? `${platform}: ${handle}` : handle;
        const href = hrefForUrl(handle, 'maybe');
        return href ? { text, href } : { text };
    }

    if (platform) return { text: platform };
    return null;
}
