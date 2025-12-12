import { Ingot } from '../../types/ingot-types';
import { SortOrder } from '../../types/sorting-types';

export default class IngotHelpers {
    /**
     * Check that billets can be sorted by date or not
     * @param ingotData
     * @returns
     */
    static checkBilletsCanBeSortedByDate(ingotData: Ingot | Ingot[]): boolean {
        const ingots: Ingot[] = Array.isArray(ingotData)
            ? ingotData
            : [ingotData];

        return ingots.some(
            (ingot: Ingot) =>
                ingot.content.billets.length > 0 &&
                ingot.content.billets.some((billet) =>
                    Object.values(billet.fields).some(
                        (f) => f.inputType === 'date'
                    )
                )
        );
    }

    /**
     * Check that ingots can be sorted by date or not
     * @param ingotData
     * @returns
     */
    static checkIngotsCanBeSortedByDate(ingotData: Ingot | Ingot[]): boolean {
        const ingots: Ingot[] = Array.isArray(ingotData)
            ? ingotData
            : [ingotData];

        return ingots.some((ingot) =>
            Object.values(ingot.content.fields).some(
                (field) => field.inputType === 'date'
            )
        );
    }

    private static getIngotDate = (ingot: Ingot): number => {
        // Try to find a date field
        const dateField = Object.values(ingot.content.fields).find(
            (f) => f.inputType === 'date'
        );
        if (dateField && dateField.value) {
            // Handle "Present" or "Current"
            if (
                dateField.value.toLowerCase() === 'present' ||
                dateField.value.toLowerCase() === 'current'
            ) {
                return new Date().getTime();
            }
            return new Date(dateField.value).getTime();
        }
        // Fallback to createdAt
        return new Date(ingot.createdAt).getTime();
    };

    /**
     * Sort Ingots by Sort Type
     * @param ingots
     * @param sortBy
     * @returns
     */
    static sortIngots = (ingots: Ingot[], sortBy?: SortOrder): Ingot[] => {
        if (!sortBy || sortBy === 'none') return ingots;

        return [...ingots].sort((a, b) => {
            const dateA = this.getIngotDate(a);
            const dateB = this.getIngotDate(b);
            return sortBy === 'date-desc' ? dateB - dateA : dateA - dateB;
        });
    };
}
