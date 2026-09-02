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
