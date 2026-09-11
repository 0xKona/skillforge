/**
 * Formats an ISO date string into a relative or localised date description.
 */
export function formatRelativeDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Edited today';
    if (diffDays === 1) return 'Edited yesterday';
    if (diffDays < 30) return `Edited ${diffDays} days ago`;
    return `Edited ${date.toLocaleDateString()}`;
}

/**
 * Safely parses a date string into a numeric timestamp.
 * Handles 'present' / 'current' keywords and returns 0 for empty or invalid dates.
 */
export function parseDateTimestamp(value?: string | null): number {
    if (!value) return 0;
    const lower = value.trim().toLowerCase();
    if (lower === 'present' || lower === 'current') return Date.now();
    const ts = new Date(value).getTime();
    return Number.isNaN(ts) ? 0 : ts;
}
