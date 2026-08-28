import CvEditorClient from './client';

export function generateStaticParams() {
    // Static export requires at least one entry.
    // The actual CV is loaded client-side by ID from the URL.
    return [{ cvId: 'placeholder' }];
}

export default function CvEditorPage() {
    return <CvEditorClient />;
}
