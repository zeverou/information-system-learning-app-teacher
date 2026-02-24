import DbHandler from "~/composables/DbHandler";
import { Participant } from "./SystemDatabase/Participant";
import { Task } from "./Task";
import { Component } from "./Component";
import { IndexedDbHandler } from "~/utils/IndexedDbHandler";

export interface Table<T = any> {
  id?: string;
  name: string;
  data: T[];
}

export class InformationSystem {

  // TODO: use db attribute for IS
  public db: DbHandler | null;
  public defaultComponentMap: Component[] = [];
  public actualComponentMap: Component[] = [];

  constructor(
    public id: number,
    public directory: string,
    public name: string,
    public description: string,
    public tables: Table[],
    public tasks: Task[] = [],
    public configData: any,
    public dbNumber: number = 0,
    public dbInitialized: boolean = false,
    defaultComponentMap: Component[] = [],
    actualComponentMap: Component[] = []
  ) {
    // Don't initialize db here - it will be set later during hydration
    this.db = null as any;
    this.defaultComponentMap = defaultComponentMap;
    this.actualComponentMap = actualComponentMap;
  }

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
      this.db = new DbHandler();
    }
    await this.db.init(json);
    this.dbInitialized = true;
    console.log("Database initialized for Information System:", this.name);
  }

  public async databaseInitNew(json: any, csvData: Record<string, string>): Promise<void> {
    console.log("Initializing database for Information System (new):", this.name);
    if (!this.db) {
      this.db = new DbHandler();
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
}