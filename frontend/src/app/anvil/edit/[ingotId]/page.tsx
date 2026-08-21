import IngotEditorWrapper from '@/components/layout/wrappers/ingot-editor-wrapper';

export default async function EditIngotPage({
    params,
}: {
    params: Promise<{ ingotId: string }>;
}) {
    const { ingotId } = await params;

    return <IngotEditorWrapper ingotId={ingotId} />;
}
