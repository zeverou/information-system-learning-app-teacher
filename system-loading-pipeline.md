# Information System Loading Pipeline

This document explains the end-to-end process of how an information system is imported from a ZIP file and eventually rendered inside the Vue templates.

## 1. ZIP File Upload (`app/pages/systems/index.vue`)
The pipeline begins when a user uploads a `.zip` file from the Information Systems page.
- The `UFileUpload` component captures the user's `File`.
- The async flow creates a loader via `SystemZipLoader.create(file)`.

## 2. ZIP Extraction (`app/utils/SystemZipLoader.ts`)
The `SystemZipLoader` uses `JSZip` to load all resources into memory. 
- It scans the contents of the ZIP, finding the core configuration file (`config.json`).
- If `config.json` is found, it parses it into a Javascript object (`configData`).
- It extracts the file contents of all `.csv` files inside the ZIP, transforming them into a dictionary (`csvData`) mapped by filename.

## 3. Hydration from Dexie JS (Auto-load on startup)
When you reload the page or open the Information Systems page, the app doesn't wait for a ZIP.
- `useInformationSystemStore` triggers `loadSystemsFromIndexedDB()`.
- It queries all saved system metadata from the `systems` table.
- Each system is "hydrated" (re-instantiated in memory), so they appear in your list immediately.

## 4. Database Re-Initialization (Entering a System)
When you click **"Enter System"**, the app ensures the SQL engine is ready.
- It calls `InformationSystem.databaseInitStatic()`.
- This checks Dexie's `databases` table for the binary SQLite export (`Uint8Array`).
- If found, it loads that binary directly into the `sql.js` engine. This restores all your previous data, participants, and changes without needing the original CSVs again.

## 5. Persistence with Dexie JS (`app/utils/IndexedDbHandler.ts`)
The application uses **Dexie JS** to manage an IndexedDB instance called `InformationSystemDB`, which ensures systems persist across page reloads.

### Where it is stored?
Internally, the `InformationSystemDB` contains three main tables:
- **`systems` table**: Stores system metadata (JSON strings) including name, description, and configuration.
- **`databases` table**: Stores the actual binary SQLite database exports as `Uint8Array`.
- **`components` table**: Stores the default and user-modified component logic (the "actual" maps).

### When it is stored?
Storage operations happen at these critical points:
1. **Initial Upload**: Immediately after `databaseInitNew` finishes importing CSVs, it calls `saveToIndexedDB()` to persist the new system.
2. **Metadata Updates**: Whenever system properties (like name or description) are changed.
3. **Component Edits**: When a user modifies component SQL/JS logic via the UI, the `ComponentCodeStore` interactions trigger `saveComponentMaps()`.
4. **Binary Sync**: When a user executes a "Save" action or specific system triggers occur, the in-memory SQLite database is exported and synced back to the `databases` table in IndexedDB.

## 6. Rendering Dynamic UI in Vue Templates (`app/components/infsys_components/**/*.vue`)
The actual layout uses concrete Vue components on the frontend, which act as dynamic wrappers fetching logic and presentation from the stores.
- **Fetching Definitions**: A Vue component (`ParticipantsCapacityCount.vue`, for example) uses the `ComponentCodeStore` to fetch its behavior by an ID string (like `"participants-capacity-count"`).
- **Evaluating SQL**: Computed properties read the SQL mapping (e.g. `component.value?.sql?.['sql-total-all']`) and run it dynamically against `selectedSystemStore.selectedSystem.db.query(...)`. The result updates the local reactive values dynamically.
- **Dynamic JavaScript Bindings**: Any JS formatting or calculations configured by the `Component` instance are constructed into native JS functions using the constructor `new Function(..., ...jsBlueprint)` allowing fully customizable UI evaluations (such as resolving fill capacity percentages).
- **Template Painting**: The standard `<template>` elements render relying on these reactive states, successfully displaying the loaded internal data structure and responding to updates.

---

## 7. Database Creation from Config & CSV (`app/composables/DbHandler.ts`)

The logical core of the system is a **SQL.js** (SQLite) database, which is constructed dynamically from the ZIP's `config.json` and `.csv` files during the first "installation" (or reset).

### Step-by-Step Construction:

1. **WASM Initialization**:
   The app loads `sql-wasm.wasm`. This is the binary engine that allows real SQLite to run inside your browser's memory.

2. **Schema Definition (`config.json`)**:
   The `DbHandler` reads the `tables` array from your configuration. Each table entry provides a mapping between a **standard ID** (e.g., `participants`) and a **user-defined name** (e.g., `list_of_students`).

3. **Table Creation (`CREATE TABLE`)**:
   The `createTables()` method executes hardcoded `CREATE TABLE` statements. It uses the names defined in your config, ensuring that the database "speaks the language" of your specific system while maintaining a predictable internal structure.
   - It creates the core entities: `participants`, `meals`, `sessions`, `supervisors`, `allergens`.
   - It sets up many-to-many relationship tables: `meals_participants`, `sessions_participants`, `participants_allergens`, etc.

4. **Data Import (`insertData`)**:
   The app loops through each table defined in the config:
   - **CSV Selection**: It matches the `csv_path` in the config to a file in the ZIP.
   - **Parsing**: It uses **PapaParse** to transform raw CSV text into Javascript objects, handling trimming and type conversion (numbers/dates).
   - **SQL Insertion**: It uses prepared statements (`INSERT INTO ... VALUES (?, ?, ...)`) to populate the tables with the parsed rows.

### The result:
By the end of this process, the `DbHandler` instance contains a fully functional, relational database in memory. This instance is then converted to a binary blob and stored in **Dexie JS**, making it permanent for all future visits.
