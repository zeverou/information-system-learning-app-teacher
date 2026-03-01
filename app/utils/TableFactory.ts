import type { Table } from '~/model/Table';
import { ColumnType } from './ColumnType';
import { Operation } from './Operation';
import { OperationResultType } from './OperationResultType';
import initSqlJs, { type Database } from 'sql.js';

export class TableFactory {

    public async createDatabase(csvFilesContent: Record<string, string>): Promise<Operation<Database | null>> {
        const SQL = await initSqlJs({
            // github pages:
            // locateFile: () => '/information-system-learning-app/sql-wasm.wasm'

            locateFile: () => '/information-system-learning-app/sql-wasm.wasm'
        });

        const db = new SQL.Database();
        let isSuccessful = true;

        // 1) CREATE TABLES
        for (const [filename, content] of Object.entries(csvFilesContent)) {

            // the 1st line of the csv file
            const lines: string[] = content.split('\n');

            if (content.trim() === '') {
                return new Operation<Database | null>(OperationResultType.ERROR, `Error creating table ${filename}: No content`, null);
            }

            const headerLine: string = lines[0];
            const result = this.getCreateTableSql(filename, headerLine);
            if (result.result === OperationResultType.SUCCESS && result.data) {
                const createTableSql = result.data;
                try {
                    db.run(createTableSql);
                } catch (error) {
                    isSuccessful = false;
                    return new Operation<Database | null>(OperationResultType.ERROR, `Error creating table ${filename}: ${error}`, null);
                }
            } else {
                return new Operation<Database | null>(OperationResultType.ERROR, result.message, null);
            }
        }

        // 2) INSERT DATA
        for (const [filename, content] of Object.entries(csvFilesContent)) {
            const lines: string[] = content.split('\n');

            if (content.trim() === '') {
                return new Operation<Database | null>(OperationResultType.ERROR, `Error creating table ${filename}: No content`, null);
            }

            const headerLine: string = lines[0];
            const tableName: string = filename;
            const dataLines: string[] = lines.slice(1).filter(line => line.trim() !== '');
            const result = this.GetInsertDataSql(tableName, headerLine, dataLines);
            if (result.result === OperationResultType.SUCCESS && result.data) {
                const insertDataSql = result.data;
                try {
                    db.run(insertDataSql);
                } catch (error) {
                    isSuccessful = false;
                    return new Operation<Database | null>(OperationResultType.ERROR, `Error inserting data into table ${filename}: ${error}`, null);
                }
            } else {
                return new Operation<Database | null>(OperationResultType.ERROR, result.message, null);
            }
        }
        if (isSuccessful) {
            return new Operation<Database | null>(OperationResultType.SUCCESS, "Database created successfully", db);
        } else {
            return new Operation<Database | null>(OperationResultType.ERROR, "Error creating database", null);
        }
    }

    /**
     * Generates a CREATE TABLE SQL statement based on the CSV header line.
     * @param csvName The name of the CSV file (used as the table name)
     * @param csvHeader The header line of the CSV file, defining column names and types in the format "columnName[columnType]"
     * @returns An Operation containing the generated SQL statement or an error message if the header format is invalid or contains unsupported column types.
     */
    public getCreateTableSql(csvName: string, csvHeader: string): Operation<string> {
        const tableName = csvName;

        const columns: string[] = [];
        for (const col of csvHeader.split(',')) {
            const match = col.trim().match(/^(.+?)\[(.+?)\]$/);
            if (!match) {
                return new Operation<string>(OperationResultType.ERROR, `Invalid column definition: "${col}". Expected format: "columnName[columnType]"`, '');
            }
            const [, colName, colType] = match;
            if (!Object.values(ColumnType).includes(colType as ColumnType)) {
                return new Operation<string>(OperationResultType.ERROR, `Unsupported column type: "${colType}". Supported types are: ${Object.values(ColumnType).join(', ')}`, '');
            }
            columns.push(`${colName} ${colType}`);
        }
        const sql: string = `CREATE TABLE IF NOT EXISTS ${tableName} (${columns.join(', ')});`;
        return new Operation<string>(OperationResultType.SUCCESS, "Sql generated successfully", sql);
    }

    /**
     * Generates an INSERT INTO SQL statement for the given table name, header line, and data lines.
     * @param tableName The name of the table to insert data into
     * @param headerLine The header line of the CSV file, defining column names and types in the format "columnName[columnType]"
     * @param dataLines An array of data lines from the CSV file, where each line corresponds to a row of data to be inserted
     * @returns An Operation containing the generated SQL statement or an error message if the data lines are malformed.
     */
    public GetInsertDataSql(tableName: string, headerLine: string, dataLines: string[]): Operation<string> {
        const columnNames = headerLine.split(',').map(col => col.trim().split('[')[0]);
        const values = dataLines.map(line => {
            const cols = line.split(',').map(col => col.trim());
            return `(${cols.join(', ')})`;
        }).join(', ');
        const sql: string = `INSERT INTO ${tableName} (${columnNames.join(', ')}) VALUES ${values};`;
        return new Operation<string>(OperationResultType.SUCCESS, "Sql generated successfully", sql);
    }


}