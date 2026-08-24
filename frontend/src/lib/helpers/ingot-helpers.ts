import {
    Award,
    Brain,
    Briefcase,
    FileText,
    GraduationCap,
    Hammer,
    Headset,
    LucideIcon,
    User,
    Volleyball,
} from 'lucide-react';
import MappingHelpers from '../classes/helpers/mapping-helpers';
import { IngotType } from '../types/ingot-types';

export function getIngotCardType(type: IngotType) {
    const label = MappingHelpers.getIngotLabelByType(type as IngotType);

    const detailsMap: Record<string, { color: string; icon: LucideIcon }> = {
        ingot_education: { color: 'bg-blue-500', icon: GraduationCap },
        ingot_experience: { color: 'bg-emerald-500', icon: Briefcase },
        ingot_project: { color: 'bg-purple-500', icon: Hammer },
        ingot_certification: {
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
