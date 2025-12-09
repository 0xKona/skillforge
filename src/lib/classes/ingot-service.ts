import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';
import { Ingot, INGOT_TYPE_LABELS, IngotContent } from '@/lib/types/ingot';
import {
    Award,
    Briefcase,
    FileText,
    GraduationCap,
    User,
    LucideIcon,
    Volleyball,
    Brain,
    Headset,
    Hammer,
} from 'lucide-react';

const client = generateClient<Schema>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapToIngot = (item: any): Ingot => {
    let content: IngotContent;
    // Handle content if it's a string (JSON stringified) or object
    if (typeof item.content === 'string') {
        try {
            content = JSON.parse(item.content);
        } catch {
            content = {} as IngotContent;
        }
    } else {
        content = item.content as IngotContent;
    }

    return {
        id: item.id,
        name: item.name,
        type: item.type,
        content,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
    };
};

export class IngotService {
    static async createIngot(
        type: string,
        name: string,
        content: IngotContent
    ): Promise<Ingot> {
        const { data: newIngot, errors } = await client.models.Ingot.create({
            name,
            type,
            content: JSON.stringify(content),
        });

        if (errors) {
            throw new Error(`Failed to create Ingot: ${errors[0].message}`);
        }

        return mapToIngot(newIngot);
    }

    static async getIngot(id: string): Promise<Ingot | null> {
        const { data: ingot, errors } = await client.models.Ingot.get({ id });

        if (errors) {
            throw new Error(`Failed to get Ingot: ${errors[0].message}`);
        }

        if (!ingot) return null;

        return mapToIngot(ingot);
    }

    static async listIngots(type?: string): Promise<Ingot[]> {
        const { data: ingots, errors } = await client.models.Ingot.list({
            filter: type ? { type: { eq: type } } : undefined,
        });

        if (errors) {
            throw new Error(`Failed to list Ingots: ${errors[0].message}`);
        }

        return ingots.map(mapToIngot);
    }

    static async listAnvilIngotData(): Promise<Ingot[]> {
        const { data: ingots, errors } = await client.models.Ingot.list({
            selectionSet: ['id', 'name', 'type', 'updatedAt'],
        });

        if (errors) {
            throw new Error(`Failed to list Ingots: ${errors[0].message}`);
        }

        return ingots.map(mapToIngot);
    }

    static async updateIngot(
        id: string,
        name: string,
        content: IngotContent
    ): Promise<Ingot> {
        const updates = {
            id,
            name,
            content: JSON.stringify(content),
        };

        const { data: updatedIngot, errors } =
            await client.models.Ingot.update(updates);

        if (errors) {
            throw new Error(`Failed to update Ingot: ${errors[0].message}`);
        }

        return mapToIngot(updatedIngot);
    }

    static async deleteIngot(id: string) {
        const { errors } = await client.models.Ingot.delete({ id });

        if (errors) {
            throw new Error(`Failed to delete Ingot: ${errors[0].message}`);
        }
    }

    static getAnvilCardDisplayDetails(type: string) {
        const labelItem = INGOT_TYPE_LABELS.find((t) => t.value === type);
        const label = labelItem
            ? labelItem.label
            : type.replace('ingot_', '').replace(/_/g, ' ');

        const detailsMap: Record<string, { color: string; icon: LucideIcon }> =
            {
                ingot_education: { color: 'bg-blue-500', icon: GraduationCap },
                ingot_experience: { color: 'bg-emerald-500', icon: Briefcase },
                ingot_project: { color: 'bg-purple-500', icon: Hammer },
                ingot_single_certification: {
                    color: 'bg-amber-500',
                    icon: Award,
                },
                ingot_personal_info: { color: 'bg-rose-500', icon: User },
                ingot_personal_statement: {
                    color: 'bg-pink-500',
                    icon: FileText,
                },
                ingot_skill: { color: 'bg-indigo-500', icon: Brain },
                ingot_hobby: { color: 'bg-orange-500', icon: Volleyball },
                ingot_reference: { color: 'bg-teal-500', icon: Headset },
            };

        const details = detailsMap[type] || {
            color: 'bg-slate-500',
            icon: FileText,
        };

        return {
            ...details,
            label,
        };
    }
}
