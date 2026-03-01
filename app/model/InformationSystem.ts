import DbHandler from "~/composables/DbHandler";
import { Task } from "./Task/Task";
import { Component } from "./Component";
import { IndexedDbHandler } from "~/utils/IndexedDbHandler";
import type { Table } from "./Table";
import type { Mapping } from "~/language/Mapping";
import type JSZip from "jszip";

/**
 * Represents an information system, encapsulating its configuration, data tables, tasks, and component mappings.
 */
export class InformationSystem {
  /**
   * Unique identifier for the system.
   */
  public id: string;

  /**
   * The language mapping used for the system. It contains how table names, columns and other elements are mapped to the system's internal 
   * representation. This is crucial for correctly interpreting the configuration and data, especially when dealing with different languages.
   */
  public mapping: Mapping;

  /**
   * The language code of the system (e.g. "cs", "en").
   */
  public language: string;

  /**
   * The name of the system.
   */
  public name: string;

  /**
   * Description of the system, providing additional context or information about its purpose and contents.
   */
  public description: string;

  /**
   * The tables contained in the information system. Eg. the supervisors table, etc.
   */
  public tables: Table[];

  /**
   * The tasks defined for the information system.
   */
  public tasks: Task[];

  /**
   * The special sync number used for forcing reactivity updates when the database is initialized or updated. 
   * Incrementing this number can be used to trigger reactivity in Vue components that depend on the database state.
   */
  public dbNumber: number;

  public db: DbHandler | null;
  public configData: any;

  public dbInitialized: boolean;
  public defaultComponentMap: Component[] = [];
  public actualComponentMap: Component[] = [];

  constructor({
    id,
    name,
    language,
    description,
    tables,
    tasks = [],
    configData,
    dbNumber = 0,
    dbInitialized = false,
    defaultComponentMap = [],
    actualComponentMap = [],
    mapping
  }: {
    id: string;
    name: string;
    language: string;
    description: string;
    tables: Table[];
    tasks?: Task[];
    configData: any;
    dbNumber?: number;
    dbInitialized?: boolean;
    defaultComponentMap?: Component[];
    actualComponentMap?: Component[];
    mapping: Mapping;
  }) {
    this.id = id;
    this.name = name;
    this.language = language;
    this.description = description;
    this.tables = tables;
    this.tasks = tasks;
    this.configData = configData;
    this.dbNumber = dbNumber;
    this.dbInitialized = dbInitialized;
    this.defaultComponentMap = defaultComponentMap;
    this.actualComponentMap = actualComponentMap;

    // Don't initialize db here - it will be set later during hydration
    this.db = null;

    this.mapping = mapping;
  }

  // TODO: Write comments
  public static async loadSystem(filesContents: Record<string, string>, mapping: Mapping,): Promise<Operation<InformationSystem | null>> {
    const configEntry = Object.entries(filesContents).find(([path]) => path.endsWith('config.json'));
    if (!configEntry) {
      return new Operation(OperationResultType.ERROR, "Config file not found.", null);
    }
    const [configPath, configContent] = configEntry;

    try {
      const configData = JSON.parse(configContent);
      const system = new InformationSystem({
        id: configData.id,
        name: configData.name,
        language: configData.language,
        description: configData.description,
        tables: configData.tables,
        tasks: (configData.tasks || []).map((task: any) => Task.fromJSON(task)),
        configData,
        mapping,
      });

      // Initialize the database with the config data and CSV contents
      // TODO

      return new Operation(OperationResultType.SUCCESS, "System loaded successfully.", system);

      /* TODO: the saving into IndexedDB shall happen after upload button click. There shall be no saving to pinia store. But after upload of the system, the pinia stores shall
      look into indexed db and update itself.
       */
    } catch (error) {
      return new Operation(OperationResultType.ERROR, "Failed to load system: " + (error instanceof Error ? error.message : String(error)), null);
    }

  }

  /*

  public static async databaseInitStatic(json: any) {
    // Try to load complete system from IndexedDB first
    if (json.id) {
      try {
        const system = await InformationSystem.loadFromIndexedDB(json.id);
        if (system && system.db) {
          console.log("Loading complete system from IndexedDB for system:", json.name);
          return system.db;
        }
      } catch (e) {
        console.error("Failed to load complete system from IndexedDB", e);
      }
    }

    // Fallback to loading database separately
    const dbHandler = await DbHandler.fromJSON(json);
    console.log("Database initialized for Information System (static):", json.name);

    // Save to IndexedDB for next time
    if (json.id) {
      try {
        const exported = dbHandler.exportDatabase();
        await IndexedDbHandler.saveSystemDB(json.id, exported);
        // Also save component maps if they exist
        if (json.defaultComponentMap || json.actualComponentMap) {
          await IndexedDbHandler.saveComponentMaps(json.defaultComponentMap || [], json.actualComponentMap || []);
        }
      } catch (e) {
        console.error("Failed to save to IndexedDB", e);
      }
    }

    return dbHandler;
  }

  public async databaseInit(json: any): Promise<void> {
    console.log("Initializing database for Information System:", this.name);
    if (!this.db) {
      const mappingToUse = this.mapping || json.mapping || json.configData?.mapping;
      this.db = new DbHandler(mappingToUse);
    }
    await this.db.init(json);
    this.dbInitialized = true;
    console.log("Database initialized for Information System:", this.name);
  }

  public async databaseInitNew(json: any, csvData: Record<string, string>): Promise<void> {
    console.log("Initializing database for Information System (new):", this.name);
    if (!this.db) {
      const mappingToUse = this.mapping || json.mapping || json.configData?.mapping;
      this.db = new DbHandler(mappingToUse);
    }
    await this.db.init(json, csvData);
    this.dbInitialized = true;
    console.log("Database initialized for Information System (new):", this.name);

    // Save complete system to IndexedDB
    try {
      await this.saveToIndexedDB();
    } catch (e) {
      console.error("Failed to save complete system to IndexedDB", e);
    }
  }

  static async fromBinary(systemId: number, json: any, dbData: Uint8Array): Promise<InformationSystem> {
    // Create system from JSON first
    const system = InformationSystem.fromJSON(json);
    // Initialize db from binary data
    system.db = await DbHandler.fromBuffer(dbData, json);
    system.dbInitialized = true;
    return system;
  }

  static fromJSON(json: any): InformationSystem {
    // Parse tables
    const tables: Table[] = (json.tables || []).map((table: any) => ({
      id: table.id,
      name: table.name,
      data: table.data,
    }));

    // Parse tasks
    const tasks: Task[] = (json.tasks || []).map((task: any) =>
      Task.fromJSON(task)
    );

    // Parse component maps
    const defaultComponentMap: Component[] = (json.defaultComponentMap || []).map((comp: any) =>
      new Component(comp)
    );
    const actualComponentMap: Component[] = (json.actualComponentMap || []).map((comp: any) =>
      new Component(comp)
    );

    return new InformationSystem(
      json.id,
      json.directory,
      json.name,
      json.description,
      tables,
      tasks,
      json.configData,
      json.dbNumber || 0,
      json.dbInitialized || false,
      defaultComponentMap,
      actualComponentMap
    );
  }

  public async saveComponentMaps(): Promise<void> {
    try {
      await IndexedDbHandler.saveComponentMaps(this.defaultComponentMap, this.actualComponentMap);
      console.log(`Saved component maps for system ${this.name}`);
    } catch (error) {
      console.error(`Failed to save component maps for system ${this.name}:`, error);
    }
  }

  // Save entire InformationSystem object to IndexedDB
  public async saveToIndexedDB(): Promise<void> {
    try {
      // Save database separately if it exists
      if (this.db) {
        const dbData = this.db.exportDatabase();
        await IndexedDbHandler.saveDatabase(this.id, dbData);
      }
      await IndexedDbHandler.saveInformationSystem(this);
      console.log(`Saved complete InformationSystem ${this.name} to IndexedDB`);
    } catch (error) {
      console.error(`Failed to save InformationSystem ${this.name} to IndexedDB:`, error);
    }
  }

  // Load entire InformationSystem object from IndexedDB
  public static async loadFromIndexedDB(systemId: number): Promise<InformationSystem | null> {
    try {
      const systemData = await IndexedDbHandler.loadInformationSystem(systemId);
      if (systemData) {
        const dbData = await IndexedDbHandler.loadDatabase(systemId);
        let system: InformationSystem;
        if (dbData) {
          // Load from saved database binary data
          system = await InformationSystem.fromBinary(systemId, systemData, dbData);
        } else {
          // Fallback to creating from JSON config
          system = InformationSystem.fromJSON(systemData);
        }
        console.log(`Loaded complete InformationSystem ${system.name} from IndexedDB`);
        return system;
      }
      return null;
    } catch (error) {
      console.error(`Failed to load InformationSystem ${systemId} from IndexedDB:`, error);
      return null;
    }
  }

  // Delete entire InformationSystem object from IndexedDB
  public static async deleteFromIndexedDB(systemId: number): Promise<void> {
    try {
      await IndexedDbHandler.deleteInformationSystem(systemId);
      await IndexedDbHandler.deleteDatabase(systemId);
      console.log(`Deleted InformationSystem ${systemId} from IndexedDB`);
    } catch (error) {
      console.error(`Failed to delete InformationSystem ${systemId} from IndexedDB:`, error);
    }
  }

  */


}