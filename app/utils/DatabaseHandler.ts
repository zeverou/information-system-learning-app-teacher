import type { Database } from "sql.js";
import { Operation } from "./Operation";
import { OperationResultType } from "./OperationResultType";

// TODO: Write unit & integration tests

/**
 * Utility class for handling database operations.
 */
export class DatabaseHandler {



    /**
     * Executes a query on the database.
     * @param db The database to be handled.
     * @param query The query to execute.
     * @returns An Operation containing the result of the query.
     */
    public static async query(db: Database, query: string): Promise<Operation<any>> {
        try {
            const result = db.exec(query);
            return new Operation<any>(OperationResultType.SUCCESS, "Query executed successfully", result);
        } catch (error) {
            return new Operation<any>(OperationResultType.ERROR, `Error executing query: ${error}`, null);
        }
    }

    /**
     * Executes a query on the database.
     * @param db The database to be handled.
     * @param query The query to execute.
     * @returns An Operation containing the result of the query.
     */
    public static async execute(db: Database, query: string): Promise<Operation<null>> {
        try {
            db.run(query);
            return new Operation<null>(OperationResultType.SUCCESS, "Query executed successfully", null);
        } catch (error) {
            return new Operation<null>(OperationResultType.ERROR, `Error executing query: ${error}`, null);
        }
    }

    /**
     * Retrieves the names of all tables in the database.
     * @param db The database to be handled.
     * @returns An Operation containing an array of table names.
     */
    public static async getTableNames(db: Database): Promise<Operation<string[]>> {
        try {
            const result = db.exec("SELECT name FROM sqlite_master WHERE type='table';");
            const names: string[] = [];
            const firstResult = result[0];
            if (firstResult?.values) {
                for (const row of firstResult.values) {
                    if (row && row[0] != null) {
                        names.push(row[0].toString());
                    }
                }
            }
            return new Operation<string[]>(OperationResultType.SUCCESS, "Table names retrieved successfully", names);
        } catch (error) {
            return new Operation<string[]>(OperationResultType.ERROR, `Error retrieving table names: ${error}`, null);
        }
    }

}