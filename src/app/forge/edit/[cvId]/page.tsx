export default async function EditCvPage({
    params,
}: {
    params: Promise<{ cvId: string }>;
}) {
    const resolvedParams = await params;
    const { cvId } = resolvedParams;

    // Load ingot on server side to avoid waterfall and pass to client

    return (
        // CV Editor Component Here
        <div></div>
    );
}
