import initSqlJs, { type Database } from 'sql.js';
import { DatabaseHandler } from './DatabaseHandler';
import { OperationResultType } from './OperationResultType';
export class DatabaseWrapper {
    /**
       * The special sync number used for forcing reactivity updates when the database is initialized or updated. 
       * Incrementing this number can be used to trigger reactivity in Vue components that depend on the database state.
       */
    public dbNumber: number = 0;

    /**
     * Whether is the database for this information system initialized.
     */
    static async isDatabaseInitialized(wrapper: DatabaseWrapper | null | undefined): Promise<boolean> {
        console.log("Checking if database is initialized");
        if (!wrapper || wrapper.sqlJsDatabase === null) return false;
        const result = await DatabaseHandler.getTableNames(wrapper.sqlJsDatabase);
        return result.result === OperationResultType.SUCCESS;
    }

    private constructor(
        public sqlJsDatabase: Database | null,
        public binaryData: Uint8Array | null
    ) { }

    static fromInstance(db: Database): DatabaseWrapper {
        return new DatabaseWrapper(db, null);
    }

    static fromBinary(data: Uint8Array): DatabaseWrapper {
        return new DatabaseWrapper(null, data);
    }

    public async initializeDatabase(): Promise<void> {
        if (this.sqlJsDatabase !== null) return;
        if (this.binaryData === null) return;

        const SQL = await initSqlJs({
            locateFile: () => '/information-system-learning-app/sql-wasm.wasm'
        });

        this.sqlJsDatabase = new SQL.Database(this.binaryData);
        this.dbNumber++;
        console.log("Database initialized");
    }
}