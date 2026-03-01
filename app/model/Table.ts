/**
 * Defines the structure of a table within the information system.
 */
export interface Table<T = any> {
    /**
     * Optional unique identifier for the table.
     */
    id?: string;

    /**
     * The name of the table, used for display and reference purposes.
     */
    name: string;

    /**
     * The actual data contained in the table, represented as an array of generic type T.
     * Thanks to the generic type parameter, it can hold numbers, strings or even complex objects, depending on the specific use case.
     */
    data: T[];
}