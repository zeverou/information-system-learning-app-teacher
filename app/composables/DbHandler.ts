import initSqlJs from 'sql.js';
import Papa from "papaparse";
import type { Mapping } from '~/language/Mapping';
import { MappingCs } from '~/language/MappingCs';

export default class DbHandler {

    private db: any;

    private tableNameMap: Map<string, string> = new Map();

    constructor(public mapping: Mapping = new MappingCs()) {
        this.db = null;
    }

    public static async fromJSON(json: any, csvData?: Record<string, string>): Promise<DbHandler> {

        const SQL = await initSqlJs({
            // github pages:
            // locateFile: () => '/information-system-learning-app/sql-wasm.wasm'

            locateFile: () => '/information-system-learning-app/sql-wasm.wasm'
        });

        const mappingToUse = json.mapping || json.configData?.mapping || new MappingCs();
        const dbHandler: DbHandler = new DbHandler(mappingToUse);
        dbHandler.db = new SQL.Database();

        console.log("JSON 1", json);

        // Ensure we are using the configData tables if available, as they contain IDs
        const tables = json.configData?.tables || json.tables;
        dbHandler.tableNameMap = dbHandler.getTableNameMap(tables);

        dbHandler.createTables(tables);

        await dbHandler.insertData(json, csvData);
        return dbHandler;
    }

    public static async fromBuffer(buffer: Uint8Array, json: any): Promise<DbHandler> {
        const mappingToUse = json.mapping || json.configData?.mapping || new MappingCs();
        const dbHandler = new DbHandler(mappingToUse);
        await dbHandler.initFromBuffer(buffer, json);
        return dbHandler;
    }

    public async initFromBuffer(buffer: Uint8Array, json: any): Promise<void> {
        const SQL = await initSqlJs({
            locateFile: () => '/information-system-learning-app/sql-wasm.wasm'
        });
        this.db = new SQL.Database(buffer);
        // Ensure we are using the configData tables if available, as they contain IDs
        const tables = json.configData?.tables || json.tables;
        this.tableNameMap = this.getTableNameMap(tables);
    }

    public exportDatabase(): Uint8Array {
        return this.db.export();
    }

    public async init(json: any, csvData?: Record<string, string>): Promise<void> {
        // Use the WASM file from the public directory
        const SQL = await initSqlJs({
            // github pages:
            // locateFile: () => '/information-system-learning-app/sql-wasm.wasm'

            locateFile: () => '/information-system-learning-app/sql-wasm.wasm'
        });

        this.db = new SQL.Database();
        console.log("JSON 2", json.tables);

        // Ensure we are using the configData tables if available, as they contain IDs
        const tables = json.configData?.tables || json.tables;
        this.tableNameMap = this.getTableNameMap(tables);

        // Create tables and insert data
        this.createTables(tables);
        await this.insertData(json, csvData);
    }

    private getTableNameMap(tables: any[]): Map<string, string> {
        const map = new Map<string, string>();
        if (!tables) return map;
        tables.forEach(table => {
            if (table.id) {
                map.set(table.id, table.name);
            } else {
                // Fallback: if id is missing, try to infer it from name or use name as id
                // This handles cases where tables array comes from InformationSystem.tables (which lacks id)
                // We assume standard table names map to standard IDs
                const standardTables = [
                    'participants', 'meals', 'sessions', 'supervisors', 'allergens',
                    'allergens_meals', 'meals_participants', 'meals_supervisors',
                    'participants_allergens', 'supervisors_allergens',
                    'sessions_supervisors', 'sessions_participants', 'meals_book'
                ];
                // Simple heuristic: if name matches a standard ID, use it
                // Or if we can't determine, we might be in trouble.
                // But ideally, we should always use configData which has IDs.
                console.warn(`Table ${table.name} is missing ID. Map might be incomplete.`);
            }
        });
        return map;
    }

    public getTableName(tableId: string): string | undefined {
        return this.tableNameMap.get(tableId);
    }

    public static getTableNameStatic(tableNameMap: Map<string, string>, tableId: string): string | undefined {
        return tableNameMap.get(tableId);
    }

    private createTables(tables: any[]): void {

        // Create participants table
        try {
            this.db.exec(`
            CREATE TABLE ${this.tableNameMap.get('participants')} (
                participant_id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                personal_number TEXT NOT NULL,
                phone TEXT NOT NULL,
                address TEXT NOT NULL,
                age INTEGER NOT NULL
            )
        `);
            console.log("Participants table created successfully. ✅");
        } catch (error) {
            console.error('Error creating participants table: ⛔', error);
        }

        try {
            // Create meals table
            this.db.exec(`
            CREATE TABLE ${this.tableNameMap.get('meals')} (
                meal_id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                when_served TEXT NOT NULL
            )
        `);
            console.log("Meals table created successfully. ✅");
        } catch (error) {
            console.error('Error creating meals table: ⛔', error);
        }

        try {
            // Create sessions table
            this.db.exec(`
            CREATE TABLE ${this.tableNameMap.get('sessions')} (
                session_id INTEGER PRIMARY KEY,
                from_date TEXT NOT NULL,
                to_date TEXT NOT NULL,
                capacity INTEGER NOT NULL
            )
        `);
            console.log("Sessions table created successfully. ✅");
        } catch (error) {
            console.error('Error creating sessions table: ⛔', error);
        }

        try {
            // Create supervisors table
            this.db.exec(`
            CREATE TABLE ${this.tableNameMap.get('supervisors')} (
                supervisor_id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                personal_number TEXT NOT NULL,
                phone TEXT NOT NULL,
                address TEXT NOT NULL,
                age INTEGER NOT NULL
            )
        `);
            console.log("Supervisors table created successfully. ✅");
        } catch (error) {
            console.error('Error creating supervisors table ⛔:', error);
        }

        try {
            // Create allergens table
            this.db.exec(`
            CREATE TABLE ${this.tableNameMap.get('allergens')} (
                allergen_id INTEGER PRIMARY KEY,
                name TEXT NOT NULL
            )
        `);
            console.log("Allergens table created successfully. ✅");
        } catch (error) {
            console.error('Error creating allergens table: ⛔', error);
        }

        try {
            this.db.exec(`
            CREATE TABLE ${this.tableNameMap.get('allergens_meals')} (
                allergen_id INTEGER NOT NULL,
                meal_id INTEGER NOT NULL,
                PRIMARY KEY (allergen_id, meal_id)
            )
        `);
            console.log("Allergens_meals table created successfully. ✅");
        } catch (error) {
            console.error('Error creating allergens_meals table: ⛔', error);
        }

        try {
            this.db.exec(`
            CREATE TABLE ${this.tableNameMap.get('meals_participants')} (
                meal_id INTEGER NOT NULL,
                participant_id INTEGER NOT NULL,
                date_served TEXT NOT NULL,
                PRIMARY KEY (participant_id, meal_id, date_served)
            )
        `);
            console.log("Meals_participants table created successfully. ✅");
        } catch (error) {
            console.error('Error creating meals_participants table: ⛔', error);
        }

        try {
            this.db.exec(`
            CREATE TABLE ${this.tableNameMap.get('meals_supervisors')} (
                meal_id INTEGER NOT NULL,
                supervisor_id INTEGER NOT NULL,
                date_served TEXT NOT NULL,
                PRIMARY KEY (supervisor_id, meal_id, date_served)
            )
        `);
            console.log("Meals_supervisors table created successfully. ✅");
        } catch (error) {
            console.error('Error creating meals_supervisors table: ⛔', error);
        }

        try {
            this.db.exec(`
            CREATE TABLE ${this.tableNameMap.get('participants_allergens')} (
                participant_id INTEGER NOT NULL,
                allergen_id INTEGER NOT NULL,
                PRIMARY KEY (participant_id, allergen_id)
            )
        `);
            console.log("Participants_allergens table created successfully. ✅");
        } catch (error) {
            console.error('Error creating participants_allergens table: ⛔', error);
        }

        try {
            this.db.exec(`
            CREATE TABLE ${this.tableNameMap.get('supervisors_allergens')} (
                supervisor_id INTEGER NOT NULL,
                allergen_id INTEGER NOT NULL,
                PRIMARY KEY (supervisor_id, allergen_id)
            )
        `);
            console.log("Supervisors_allergens table created successfully. ✅");
        } catch (error) {
            console.error('Error creating supervisors_allergens table: ⛔', error);
        }

        try {
            this.db.exec(`
            CREATE TABLE ${this.tableNameMap.get('sessions_supervisors')} (
                session_id INTEGER NOT NULL,
                supervisor_id INTEGER NOT NULL,
                PRIMARY KEY (session_id, supervisor_id)
            )
        `);
            console.log("Sessions_supervisors table created successfully. ✅");
        } catch (error) {
            console.error('Error creating sessions_supervisors table: ⛔', error);
        }

        try {
            this.db.exec(`
            CREATE TABLE ${this.tableNameMap.get('sessions_participants')} (
                session_id INTEGER NOT NULL,
                participant_id INTEGER NOT NULL,
                PRIMARY KEY (session_id, participant_id)
            )
        `);
            console.log("Sessions_participants table created successfully. ✅");
        } catch (error) {
            console.error('Error creating sessions_participants table: ⛔', error);
        }

        // Add meals_book table
        try {
            this.db.exec(`
            CREATE TABLE ${this.tableNameMap.get('meals_book')} (
                meal_id INTEGER NOT NULL,
                date TEXT NOT NULL,
                PRIMARY KEY (meal_id, date)
            )
        `);
            console.log("Meals_book table created successfully. ✅");
        } catch (error) {
            console.error('Error creating meals_book table: ⛔', error);
        }
    }

    private async insertData(json: any, csvData?: Record<string, string>): Promise<void> {
        console.log(`Inserting data into tables for system: ${json.directory}`);

        // If csvData is provided, use it; otherwise, glob all CSVs in assets/*/csv as raw text
        const csvModules = csvData ? undefined : import.meta.glob('~/assets/data/*/csv/*.csv', { as: 'raw' });
        if (csvModules) {
            console.log("CSV MODULES:", csvModules);
        }

        // Define the prefix to filter by json.directory
        const prefix = `${json.directory}/csv/`;

        for (const table of json.tables) {
            const csvFilename = table.csv_path.split('/').pop(); // e.g., "participants.csv"

            let csvText: string;
            if (csvData && csvData[csvFilename]) {
                // Use provided CSV data
                csvText = csvData[csvFilename];
                console.log("Using provided CSV data for:", csvFilename);
            } else if (csvModules) {
                // Find the CSV that matches the directory prefix and filename
                const moduleKey = Object.keys(csvModules).find(
                    key => key.includes(prefix) && key.endsWith("/" + csvFilename)
                );

                if (!moduleKey || !csvModules![moduleKey]) {
                    console.warn(`CSV not found for table: ${table.id}, file: ${csvFilename}`);
                    continue;
                }

                // Load CSV content
                csvText = await csvModules![moduleKey]();
                console.log("CSV PATH:", moduleKey);
            } else {
                console.warn(`CSV not found for table: ${table.id}, file: ${csvFilename}`);
                continue;
            }

            console.log("CSV FILENAME:", csvFilename);

            // Parse CSV with PapaParse
            const { data: rows } = Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                dynamicTyping: true, // convert numbers automatically
                transform: (value) => value.trim() // trim leading/trailing spaces
            });

            console.log(`Table: ${table.id}, Rows:`, rows);

            // Call the appropriate insert method dynamically
            const methodMap: Record<string, Function> = {
                participants: this.insertParticipants,
                meals: this.insertMeals,
                sessions: this.insertSessions,
                supervisors: this.insertSupervisors,
                allergens: this.insertAllergens,
                participants_allergens: this.insertParticipantsAllergens,
                meals_participants: this.insertMealsParticipants,
                meals_supervisors: this.insertMealsSupervisors,
                sessions_participants: this.insertParticipantsSessions,
                allergens_meals: this.insertAllergensMeals,
                supervisors_allergens: this.insertSupervisorsAllergens,
                sessions_supervisors: this.insertSessionsSupervisors,
                meals_book: this.insertMealsBook,
            };

            const insertMethod = methodMap[table.id];
            if (insertMethod) {
                await insertMethod.call(this, rows);
            } else {
                console.warn(`No insert method found for table: ${table.id}`);
            }
        }
    }


    private async insertParticipants(data: any[]): Promise<void> {

        console.log("DATA:", data);

        try {
            const stmt = this.db.prepare(`
                INSERT INTO ${this.tableNameMap.get('participants')} (participant_id, name, email, personal_number, phone, address, age)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `);
            data.forEach(row => {
                stmt.run([
                    row.participant_id,
                    row.name,
                    row.email,
                    row.personal_number,
                    row.phone,
                    row.address,
                    Number(row.age)
                ]);
            });
            stmt.free();
            console.log("Inserted participants successfully. ✅");
        } catch (error) {
            console.error('Error inserting participants: ⛔', error);
        }
    }

    private async insertMeals(data: any[]): Promise<void> {
        try {
            const stmt = this.db.prepare(`
                INSERT INTO ${this.tableNameMap.get('meals')} (meal_id, name, when_served)
                VALUES (?, ?, ?)
            `);
            data.forEach(row => {
                stmt.run([
                    row.meal_id,
                    row.name,
                    row.when_served // <-- fix here
                ]);
            });
            stmt.free();
            console.log("Inserted meals successfully. ✅");
        } catch (error) {
            console.error('Error inserting meals: ⛔', error);
        }
    }

    private async insertSessions(data: any[]): Promise<void> {
        try {
            const stmt = this.db.prepare(`
                INSERT INTO ${this.tableNameMap.get('sessions')} (session_id, from_date, to_date, capacity)
                VALUES (?, ?, ?, ?)
            `);
            data.forEach(row => {
                stmt.run([
                    row.session_id,
                    typeof row.from_date === 'object' && row.from_date !== null && row.from_date.toISOString ? row.from_date.toISOString() : String(row.from_date),
                    typeof row.to_date === 'object' && row.to_date !== null && row.to_date.toISOString ? row.to_date.toISOString() : String(row.to_date),
                    Number(row.capacity)
                ]);
            });
            stmt.free();
            console.log("Inserted sessions successfully. ✅");
        } catch (error) {
            console.error('Error inserting sessions: ⛔', error);
        }
    }

    private async insertSupervisors(data: any[]): Promise<void> {
        try {
            const stmt = this.db.prepare(`
                INSERT INTO ${this.tableNameMap.get('supervisors')} (supervisor_id, name, email, personal_number, phone, address, age)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `);
            data.forEach(row => {
                stmt.run([
                    row.supervisor_id,
                    row.name,
                    row.email,
                    row.personal_number,
                    row.phone,
                    row.address,
                    Number(row.age)
                ]);
            });
            stmt.free();
            console.log("Inserted supervisors successfully. ✅");
        } catch (error) {
            console.error('Error inserting supervisors: ⛔', error);
        }
    }

    private async insertAllergens(data: any[]): Promise<void> {
        try {
            const stmt = this.db.prepare(`
                INSERT INTO ${this.tableNameMap.get('allergens')} (allergen_id, name)
                VALUES (?, ?)
            `);
            data.forEach(row => {
                stmt.run([
                    row.allergen_id,
                    row.name
                ]);
            });
            stmt.free();
            console.log("Inserted allergens successfully. ✅");
        } catch (error) {
            console.error('Error inserting allergens: ⛔', error);
        }
    }

    // Add new insert methods for join tables
    private async insertParticipantsAllergens(data: any[]): Promise<void> {
        try {
            const stmt = this.db.prepare(`
                INSERT INTO ${this.tableNameMap.get('participants_allergens')} (participant_id, allergen_id)
                VALUES (?, ?)
            `);
            data.forEach(row => {
                stmt.run([
                    row.participant_id,
                    row.allergen_id
                ]);
            });
            stmt.free();
            console.log("Inserted participants_allergens successfully. ✅");
        } catch (error) {
            console.error('Error inserting participants_allergens: ⛔', error);
        }
    }

    private async insertMealsParticipants(data: any[]): Promise<void> {
        try {
            const stmt = this.db.prepare(`
                INSERT INTO ${this.tableNameMap.get('meals_participants')} (meal_id, participant_id, date_served)
                VALUES (?, ?, ?)
            `);
            data.forEach(row => {
                stmt.run([
                    row.meal_id ?? row.meals_id, // support both meal_id and meals_id
                    row.participant_id,
                    row.date_served
                ]);
            });
            stmt.free();
            console.log("Inserted meals_participants successfully. ✅");
        } catch (error) {
            console.error('Error inserting meals_participants: ⛔', error);
        }
    }

    private async insertMealsSupervisors(data: any[]): Promise<void> {
        try {
            const stmt = this.db.prepare(`
                INSERT INTO ${this.tableNameMap.get('meals_supervisors')} (meal_id, supervisor_id, date_served)
                VALUES (?, ?, ?)
            `);
            data.forEach(row => {
                stmt.run([
                    row.meal_id,
                    row.supervisor_id,
                    row.date_served
                ]);
            });
            stmt.free();
            console.log("Inserted meals_supervisors successfully. ✅");
        } catch (error) {
            console.error('Error inserting meals_supervisors: ⛔', error);
        }
    }

    private async insertParticipantsSessions(data: any[]): Promise<void> {
        try {
            const stmt = this.db.prepare(`
                INSERT INTO ${this.tableNameMap.get('sessions_participants')} (session_id, participant_id)
                VALUES (?, ?)
            `);
            data.forEach(row => {
                stmt.run([
                    row.session_id,
                    row.participant_id
                ]);
            });
            stmt.free();
            console.log("Inserted sessions_participants successfully. ✅");
        } catch (error) {
            console.error('Error inserting sessions_participants: ⛔', error);
        }
    }

    private async insertAllergensMeals(data: any[]): Promise<void> {
        try {
            const stmt = this.db.prepare(`
                INSERT INTO ${this.tableNameMap.get('allergens_meals')} (allergen_id, meal_id)
                VALUES (?, ?)
            `);
            data.forEach(row => {
                stmt.run([
                    row.allergen_id,
                    row.meal_id
                ]);
            });
            stmt.free();
            console.log("Inserted allergens_meals successfully. ✅");
        } catch (error) {
            console.error('Error inserting allergens_meals: ⛔', error);
        }
    }

    private async insertSupervisorsAllergens(data: any[]): Promise<void> {
        try {
            const stmt = this.db.prepare(`
                INSERT INTO ${this.tableNameMap.get('supervisors_allergens')} (supervisor_id, allergen_id)
                VALUES (?, ?)
            `);
            data.forEach(row => {
                stmt.run([
                    row.supervisor_id,
                    row.allergen_id
                ]);
            });
            stmt.free();
            console.log("Inserted supervisors_allergens successfully. ✅");
        } catch (error) {
            console.error('Error inserting supervisors_allergens: ⛔', error);
        }
    }

    private async insertSessionsSupervisors(data: any[]): Promise<void> {
        try {
            const stmt = this.db.prepare(`
                INSERT INTO ${this.tableNameMap.get('sessions_supervisors')} (session_id, supervisor_id)
                VALUES (?, ?)
            `);
            data.forEach(row => {
                stmt.run([
                    row.session_id,
                    row.supervisor_id
                ]);
            });
            stmt.free();
            console.log("Inserted sessions_supervisors successfully. ✅");
        } catch (error) {
            console.error('Error inserting sessions_supervisors: ⛔', error);
        }
    }

    // Add insertMealsBook method
    private async insertMealsBook(data: any[]): Promise<void> {
        try {
            const stmt = this.db.prepare(`
                INSERT INTO ${this.tableNameMap.get('meals_book')} (meal_id, date)
                VALUES (?, ?)
            `);
            data.forEach(row => {
                stmt.run([
                    row.meal_id,
                    row.date
                ]);
            });
            stmt.free();
            console.log("Inserted meals_book successfully. ✅");
        } catch (error) {
            console.error('Error inserting meals_book: ⛔', error);
        }
    }

    public query(sql: string, params?: any[]): { success: boolean; results: any[] } {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        const results: any[] = [];

        try {
            const stmt = this.db.prepare(sql);

            // Only bind parameters if the SQL contains placeholders and params are provided
            if (params && params.length > 0 && sql.includes('?')) {
                stmt.bind(params);
            }

            while (stmt.step()) {
                results.push(stmt.getAsObject());
            }

            stmt.free();

            return {
                success: true,
                results
            };
        } catch (error) {
            console.error('SQL Error:', error);
            return {
                success: false,
                results: []
            };
        }
    }


    public exec(sql: string, params?: any[]): void {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        // Only use prepared statement if the SQL contains placeholders and parameters are provided
        if (params && params.length > 0 && sql.includes('?')) {
            // Use prepared statement when parameters are provided and SQL has placeholders
            const stmt = this.db.prepare(sql);

            // if there are more ?'s than params, fill the param array with the last param to match count of ?'s


            stmt.run(params);
            stmt.free();
            console.log("EXEC SQL WITH PARAMS: ", sql, params);
        } else {
            // Use direct exec for statements without parameters or placeholders
            this.db.exec(sql);
            console.log("EXEC SQL: ", sql);
        }
    }

    public validateSql(sql: string): boolean {
        if (!this.db) {
            console.error('Database not initialized');
            return false;
        }

        if (!sql || sql.trim().length === 0) {
            console.error('SQL query is empty');
            return false;
        }

        try {
            // Try to prepare the statement to validate syntax
            const stmt = this.db.prepare(sql);

            // If preparation succeeds, the SQL is syntactically valid
            stmt.free();

            // Additional validation for common SQL injection patterns
            const lowerSql = sql.toLowerCase().trim();

            // Check for potentially dangerous operations
            const dangerousPatterns = [
                /;\s*(drop|delete|truncate|alter|create|insert|update)\s/i,
                /union\s+select.*--/i,
                /\/\*/i,  // Block comments
                /\*\//i,  // Block comments
                /--/i,    // Line comments (allow in some cases)
            ];

            for (const pattern of dangerousPatterns) {
                if (pattern.test(lowerSql)) {
                    console.warn('Potentially dangerous SQL pattern detected:', pattern);
                    // For now, we'll allow these but log a warning
                    // return false; // Uncomment to block these patterns
                }
            }

            return true;
        } catch (error) {
            console.error('SQL validation error:', error);
            return false;
        }
    }

    public getAllTableNames(): string[] {
        const sql = "SELECT name FROM sqlite_master WHERE type='table'";
        const result = this.query(sql);
        if (result.success) {
            console.log("Tables: ", this.tableNameMap);

            return result.results.map((row: any) => row.name as string);
        }
        return [];
    }
}