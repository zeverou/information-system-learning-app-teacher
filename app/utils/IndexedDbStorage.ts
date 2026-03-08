import Dexie, { type Table } from 'dexie';
import { InformationSystem } from "~/model/InformationSystem";
import { DatabaseWrapper } from './DatabaseWrapper';
import { Operation } from './Operation';
import { OperationResultType } from './OperationResultType';

interface StoredSystem {
    id: string;
    name: string;
    language: string;
    description: string;
    tasks: any[];
    actualComponents: any[];
    databaseBinary: Uint8Array | null;
}

class AppDatabase extends Dexie {
    systems!: Table<StoredSystem, string>;

    constructor() {
        super('InformationSystemsDb');
        this.version(1).stores({
            systems: 'id, name, language',
        });
    }
}

const db = new AppDatabase();

export class IndexedDbStorage {

    public static async GetStoredInformationSystemsIds(): Promise<Operation<string[]>> {
        try {
            const ids = await db.systems.toCollection().primaryKeys() as string[];
            return new Operation(OperationResultType.SUCCESS, 'IDs retrieved successfully', ids);
        } catch (error) {
            return new Operation(OperationResultType.ERROR, `Error retrieving IDs: ${error}`, []);
        }
    }

    public static async GetStoredInformationSystems(): Promise<Operation<InformationSystem[]>> {
        try {
            const records = await db.systems.toArray();
            const systems = records.map(IndexedDbStorage.toInformationSystem);
            return new Operation(OperationResultType.SUCCESS, 'Systems retrieved successfully', systems);
        } catch (error) {
            return new Operation(OperationResultType.ERROR, `Error retrieving systems: ${error}`, []);
        }
    }

    public static async SaveInformationSystem(system: InformationSystem): Promise<Operation<null>> {
        try {
            let databaseBinary: Uint8Array | null = null;
            if (system.database) {
                if (system.database.sqlJsDatabase) {
                    databaseBinary = new Uint8Array(system.database.sqlJsDatabase.export());
                } else if (system.database.binaryData) {
                    databaseBinary = system.database.binaryData;
                }
            }
            const record: StoredSystem = {
                id: system.id,
                name: system.name,
                language: system.language,
                description: system.description,
                tasks: JSON.parse(JSON.stringify(system.tasks)),
                actualComponents: JSON.parse(JSON.stringify(system.actualComponents)),
                databaseBinary,
            };
            await db.systems.put(record);
            return new Operation(OperationResultType.SUCCESS, 'System saved successfully', null);
        } catch (error) {
            return new Operation(OperationResultType.ERROR, `Error saving system: ${error}`, null);
        }
    }

    public static async LoadInformationSystem(id: string): Promise<Operation<InformationSystem | null>> {
        try {
            const record = await db.systems.get(id);
            if (!record) {
                return new Operation(OperationResultType.FAILED, `System with id '${id}' not found`, null);
            }
            return new Operation(OperationResultType.SUCCESS, 'System loaded successfully', IndexedDbStorage.toInformationSystem(record));
        } catch (error) {
            return new Operation(OperationResultType.ERROR, `Error loading system: ${error}`, null);
        }
    }

    public static async UpdateInformationSystem(system: InformationSystem): Promise<Operation<null>> {
        try {
            const existingRecord = await db.systems.get(system.id);
            if (!existingRecord) {
                return new Operation(OperationResultType.FAILED, `System with id '${system.id}' not found`, null);
            }
            let databaseBinary: Uint8Array | null = null;
            if (system.database) {
                if (system.database.sqlJsDatabase) {
                    databaseBinary = new Uint8Array(system.database.sqlJsDatabase.export());
                } else if (system.database.binaryData) {
                    databaseBinary = system.database.binaryData;
                }
            }
            const updatedRecord: StoredSystem = {
                id: system.id,
                name: system.name,
                language: system.language,
                description: system.description,
                tasks: JSON.parse(JSON.stringify(system.tasks)),
                actualComponents: JSON.parse(JSON.stringify(system.actualComponents)),
                databaseBinary,
            };
            await db.systems.put(updatedRecord);
            return new Operation(OperationResultType.SUCCESS, 'System updated successfully', null);
        } catch (error) {
            return new Operation(OperationResultType.ERROR, `Error updating system: ${error}`, null);
        }
    }

    public static async DeleteInformationSystem(id: string): Promise<Operation<null>> {
        try {
            await db.systems.delete(id);
            return new Operation(OperationResultType.SUCCESS, 'System deleted successfully', null);
        } catch (error) {
            return new Operation(OperationResultType.ERROR, `Error deleting system: ${error}`, null);
        }
    }

    private static toInformationSystem(record: StoredSystem): InformationSystem {
        const system = new InformationSystem({
            id: record.id,
            name: record.name,
            language: record.language,
            description: record.description,
            tasks: record.tasks ?? [],
            actualComponents: record.actualComponents ?? [],
        });
        if (record.databaseBinary) {
            system.database = DatabaseWrapper.fromBinary(record.databaseBinary);
        }
        return system;
    }
}

