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
import { Ingot, IngotType } from '../types/ingot-types';
import { SortOrder } from '../types/sorting-types';
import { mappingHelpers } from './mapping';

// -- Card UI mapping --

const INGOT_CARD_DETAILS: Record<string, { color: string; icon: LucideIcon }> =
    {
        ingot_education: { color: 'bg-blue-500', icon: GraduationCap },
        ingot_experience: { color: 'bg-emerald-500', icon: Briefcase },
        ingot_project: { color: 'bg-purple-500', icon: Hammer },
        ingot_certification: { color: 'bg-amber-500', icon: Award },
        ingot_personal_info: { color: 'bg-rose-500', icon: User },
        ingot_personal_statement: { color: 'bg-pink-500', icon: FileText },
        ingot_skill: { color: 'bg-indigo-500', icon: Brain },
        ingot_hobby: { color: 'bg-orange-500', icon: Volleyball },
        ingot_reference: { color: 'bg-teal-500', icon: Headset },
    };

/**
 * Returns the colour, icon, and label for an ingot type card.
 */
function getCardDetails(type: IngotType) {
    const details = INGOT_CARD_DETAILS[type] || {
        color: 'bg-slate-500',
        icon: FileText,
    };
    return { ...details, label: mappingHelpers.getIngotLabel(type) };
}

// -- Date checks --

/**
 * Checks if any billet within the given ingot(s) has a date field,
 * meaning billets can be sorted chronologically.
 */
function canSortBilletsByDate(ingotData: Ingot | Ingot[]): boolean {
    const ingots = Array.isArray(ingotData) ? ingotData : [ingotData];
    return ingots.some(
        (ingot) =>
            ingot.content.billets.length > 0 &&
            ingot.content.billets.some((billet) =>
                Object.values(billet.fields).some((f) => f.inputType === 'date')
            )
    );
}

/**
 * Checks if any of the given ingot(s) has a date field in its top-level content,
 * meaning the ingots themselves can be sorted chronologically.
 */
function canSortIngotsByDate(ingotData: Ingot | Ingot[]): boolean {
    const ingots = Array.isArray(ingotData) ? ingotData : [ingotData];
    return ingots.some((ingot) =>
        Object.values(ingot.content.fields).some(
            (field) => field.inputType === 'date'
        )
    );
}

// -- Sorting --

/**
 * Extracts the timestamp from an ingot's first date field.
 * Treats 'present' / 'current' as the current date.
 * Falls back to `createdAt` if no date field exists.
 */
function getIngotDate(ingot: Ingot): number {
    const dateField = Object.values(ingot.content.fields).find(
        (f) => f.inputType === 'date'
    );
    if (dateField && dateField.value) {
        const lower = dateField.value.toLowerCase();
        if (lower === 'present' || lower === 'current') {
            return Date.now();
        }
        return new Date(dateField.value).getTime();
    }
    return new Date(ingot.createdAt).getTime();
}

/**
 * Returns a new array of ingots sorted by date.
 * If sortBy is undefined or 'none', returns the array unchanged.
 */
function sortIngots(ingots: Ingot[], sortBy?: SortOrder): Ingot[] {
    if (!sortBy || sortBy === 'none') return ingots;

    return [...ingots].sort((a, b) => {
        const dateA = getIngotDate(a);
        const dateB = getIngotDate(b);
        return sortBy === 'date-desc' ? dateB - dateA : dateA - dateB;
    });
}

export const ingotHelpers = {
    getCardDetails,
    canSortBilletsByDate,
    canSortIngotsByDate,
    getIngotDate,
    sortIngots,
};
