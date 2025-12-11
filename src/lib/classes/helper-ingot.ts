import { Ingot } from '../types/ingot-types';

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
}
