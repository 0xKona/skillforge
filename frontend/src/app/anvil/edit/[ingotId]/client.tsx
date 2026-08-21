'use client';

import IngotEditorWrapper from '@/components/layout/wrappers/ingot-editor-wrapper';

interface EditIngotClientProps {
    ingotId: string;
}

export default function EditIngotClient({ ingotId }: EditIngotClientProps) {
    return <IngotEditorWrapper ingotId={ingotId} />;
}
