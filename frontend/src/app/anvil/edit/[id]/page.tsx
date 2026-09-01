import IngotEditorClient from './client';

export function generateStaticParams() {
    // Static export requires at least one entry. The ingot is loaded client-side by ID.
    return [{ id: 'placeholder' }];
}

export default function EditIngotPage() {
    return <IngotEditorClient />;
}
