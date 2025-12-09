import IngotEditor from '@/components/anvil/ingot-editor/ingot-editor';
import { serverClient } from '@/lib/amplify/server-data-client';
import { IngotContent, IngotType, Ingot } from '@/lib/types/ingot-types';

export default async function EditIngotPage({
    params,
}: {
    params: Promise<{ ingotId: string }>;
}) {
    const resolvedParams = await params;
    const { ingotId } = resolvedParams;

    let initialData: IngotContent | null = null;
    let initialName: string | null = null;
    let initialType: IngotType | null = null;
    let createdAt: string = new Date().toISOString();
    let updatedAt: string = new Date().toISOString();

    // Load the initial ingot data on the server side, this makes loading faster
    // by avoiding a waterfall
    try {
        const { data: ingot } = await serverClient.models.Ingot.get({
            id: ingotId,
        });

        if (ingot) {
            initialName = ingot.name;
            initialType = ingot.type as IngotType;
            createdAt = ingot.createdAt;
            updatedAt = ingot.updatedAt;
            if (ingot.content) {
                if (typeof ingot.content === 'string') {
                    try {
                        initialData = JSON.parse(ingot.content);
                    } catch {
                        initialData = null;
                    }
                } else {
                    initialData = ingot.content as IngotContent;
                }
            }
        }
    } catch (error) {
        console.error('Failed to fetch ingot on server', error);
    }

    const ingotData: Ingot = {
        id: ingotId,
        name: initialName ?? '',
        type: initialType ?? '',
        content: initialData ?? { fields: {}, billetFormat: null, billets: [] },
        createdAt,
        updatedAt,
    };

    return <IngotEditor initialIngotData={ingotData} />;
}
