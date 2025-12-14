import { Ingot } from '../../types/ingot-types';
import { SortOrder } from '../../types/sorting-types';

/**
 * Utility class providing helper methods for managing and manipulating Ingot objects.
 * This class includes methods for checking if ingots or their billets can be sorted by date, extracting dates, and sorting ingots.
 */
export default class IngotHelpers {
    /**
     * Checks if the billets within the given ingot(s) can be sorted by date.
     * It verifies if any ingot has billets with at least one field of inputType 'date'.
     * @param ingotData - A single Ingot or an array of Ingots to check.
     * @returns True if any billet has a date field, false otherwise.
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
     * Checks if the given ingot(s) can be sorted by date.
     * It verifies if any ingot has at least one field of inputType 'date' in its content.
     * @param ingotData - A single Ingot or an array of Ingots to check.
     * @returns True if any ingot has a date field, false otherwise.
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

    /**
     * Private helper method to extract and convert the date from an ingot's fields.
     * It looks for the first field with inputType 'date', handles special cases like 'present' or 'current' as the current date,
     * and returns the timestamp. If no valid date is found, falls back to the ingot's createdAt timestamp.
     * @param ingot - The Ingot object from which to extract the date.
     * @returns A number representing the timestamp of the date.
     */
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
     * Sorts an array of ingots based on the provided sort order.
     * Currently supports sorting by date in ascending or descending order.
     * If no sortBy is provided or it's 'none', returns the ingots unchanged.
     * @param ingots - The array of Ingot objects to sort.
     * @param sortBy - The sort order, either 'date-asc', 'date-desc', or 'none'.
     * @returns A new sorted array of Ingot objects.
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
