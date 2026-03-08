import { Task } from "./Task/Task";
import { Component } from "./Component";
import { DatabaseWrapper } from "~/utils/DatabaseWrapper";
import type { GUID } from "./GUID";
import type { Table } from "./Table";
import type { Mapping } from "~/language/Mapping";

/**
 * Represents an information system, encapsulating its configuration, data tables, tasks, and component mappings.
 */
export class InformationSystem {
  /**
   * Unique identifier for the system.
   */
  public id: GUID;

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
   * The tasks defined for the information system.
   */
  public tasks: Task[];

  /**
   * The user-customised component overrides for this system.
   */
  public actualComponents: Component[];

  /**
   * The SQLite database for this system, loaded lazily via DatabaseWrapper.
   */
  public database: DatabaseWrapper | null;

  /**
   * The raw config JSON. Present only after loading from a zip/config.
   */
  public configData?: any;

  /**
   * The language mapping used when the system was loaded from config.
   */
  public mapping?: Mapping;

  constructor({
    id,
    name,
    language,
    description,
    tasks = [],
    actualComponents = [],
    database = null,
    tables,
    configData,
    mapping,
  }: {
    id: GUID;
    name: string;
    language: string;
    description: string;
    tasks?: Task[];
    actualComponents?: Component[];
    database?: DatabaseWrapper | null;
    tables?: Table[];
    configData?: any;
    mapping?: Mapping;
  }) {
    this.id = id;
    this.name = name;
    this.language = language;
    this.description = description;
    this.tasks = tasks;
    this.actualComponents = actualComponents;
    this.database = database;
    this.tables = tables;
    this.configData = configData;
    this.mapping = mapping;
  }

  /**
   * Creates an InformationSystem from a raw config JSON string.
   * Throws SyntaxError if the JSON is invalid.
   */
  public static fromConfig(configJson: string): InformationSystem {
    const configData = JSON.parse(configJson);
    return new InformationSystem({
      id: String(configData.id) as GUID,
      name: configData.name,
      language: configData.language,
      description: configData.description,
      configData,
    });
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
        id: configData.id as GUID,
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


}