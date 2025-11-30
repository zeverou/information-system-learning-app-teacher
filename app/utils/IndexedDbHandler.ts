export class IndexedDbHandler {
    private static DB_NAME = 'InformationSystemDB';
    private static SYSTEMS_STORE_NAME = 'systems';
    private static DATABASES_STORE_NAME = 'databases';
    private static COMPONENT_STORE_NAME = 'components';
    private static VERSION = 3; // Increased version to add databases store

    private static async openDB(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.DB_NAME, this.VERSION);

            request.onerror = (event) => {
                console.error("IndexedDB error:", event);
                reject("IndexedDB error");
            };

            request.onsuccess = (event) => {
                resolve((event.target as IDBOpenDBRequest).result);
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(this.SYSTEMS_STORE_NAME)) {
                    db.createObjectStore(this.SYSTEMS_STORE_NAME);
                }
                if (!db.objectStoreNames.contains(this.DATABASES_STORE_NAME)) {
                    db.createObjectStore(this.DATABASES_STORE_NAME);
                }
                if (!db.objectStoreNames.contains(this.COMPONENT_STORE_NAME)) {
                    db.createObjectStore(this.COMPONENT_STORE_NAME);
                }
            };
        });
    }

    public static async saveSystemDB(systemId: number, data: Uint8Array): Promise<void> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.SYSTEMS_STORE_NAME], 'readwrite');
            const store = transaction.objectStore(this.SYSTEMS_STORE_NAME);
            const request = store.put(data, systemId);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    public static async loadSystemDB(systemId: number): Promise<Uint8Array | null> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.SYSTEMS_STORE_NAME], 'readonly');
            const store = transaction.objectStore(this.SYSTEMS_STORE_NAME);
            const request = store.get(systemId);

            request.onsuccess = () => {
                resolve(request.result ? (request.result as Uint8Array) : null);
            };
            request.onerror = () => reject(request.error);
        });
    }
    
    public static async deleteSystemDB(systemId: number): Promise<void> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.SYSTEMS_STORE_NAME], 'readwrite');
            const store = transaction.objectStore(this.SYSTEMS_STORE_NAME);
            const request = store.delete(systemId);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // Database storage methods
    public static async saveDatabase(systemId: number, data: Uint8Array): Promise<void> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.DATABASES_STORE_NAME], 'readwrite');
            const store = transaction.objectStore(this.DATABASES_STORE_NAME);
            const request = store.put(data, `system_${systemId}`);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    public static async loadDatabase(systemId: number): Promise<Uint8Array | null> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.DATABASES_STORE_NAME], 'readonly');
            const store = transaction.objectStore(this.DATABASES_STORE_NAME);
            const request = store.get(`system_${systemId}`);

            request.onsuccess = () => {
                resolve(request.result ? (request.result as Uint8Array) : null);
            };
            request.onerror = () => reject(request.error);
        });
    }

    public static async deleteDatabase(systemId: number): Promise<void> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.DATABASES_STORE_NAME], 'readwrite');
            const store = transaction.objectStore(this.DATABASES_STORE_NAME);
            const request = store.delete(`system_${systemId}`);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // Component Maps storage methods
    public static async saveComponentMaps(defaultComponentMap: any[], actualComponentMap: any[]): Promise<void> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.COMPONENT_STORE_NAME], 'readwrite');
            const store = transaction.objectStore(this.COMPONENT_STORE_NAME);
            
            const data = {
                defaultComponentMap: JSON.stringify(defaultComponentMap),
                actualComponentMap: JSON.stringify(actualComponentMap),
                timestamp: Date.now()
            };
            
            const request = store.put(data, 'componentMaps');

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    public static async loadComponentMaps(): Promise<{defaultComponentMap: any[], actualComponentMap: any[]} | null> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.COMPONENT_STORE_NAME], 'readonly');
            const store = transaction.objectStore(this.COMPONENT_STORE_NAME);
            const request = store.get('componentMaps');

            request.onsuccess = () => {
                if (request.result) {
                    try {
                        const data = request.result;
                        resolve({
                            defaultComponentMap: JSON.parse(data.defaultComponentMap || '[]'),
                            actualComponentMap: JSON.parse(data.actualComponentMap || '[]')
                        });
                    } catch (e) {
                        console.error('Error parsing component maps from IndexedDB:', e);
                        resolve(null);
                    }
                } else {
                    resolve(null);
                }
            };
            request.onerror = () => reject(request.error);
        });
    }

    public static async deleteComponentMaps(): Promise<void> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.COMPONENT_STORE_NAME], 'readwrite');
            const store = transaction.objectStore(this.COMPONENT_STORE_NAME);
            const request = store.delete('componentMaps');

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // Save entire InformationSystem object
    public static async saveInformationSystem(system: any): Promise<void> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.SYSTEMS_STORE_NAME], 'readwrite');
            const store = transaction.objectStore(this.SYSTEMS_STORE_NAME);
            
            // Convert system to JSON for storage, excluding db
            const systemCopy = { ...system, db: null };
            const systemData = JSON.stringify(systemCopy);
            const request = store.put(systemData, `system_${system.id}`);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // Load entire InformationSystem object
    public static async loadInformationSystem(systemId: number): Promise<any | null> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.SYSTEMS_STORE_NAME], 'readonly');
            const store = transaction.objectStore(this.SYSTEMS_STORE_NAME);
            const request = store.get(`system_${systemId}`);

            request.onsuccess = () => {
                if (request.result) {
                    try {
                        const systemData = JSON.parse(request.result);
                        resolve(systemData);
                    } catch (e) {
                        console.error('Error parsing InformationSystem from IndexedDB:', e);
                        resolve(null);
                    }
                } else {
                    resolve(null);
                }
            };
            request.onerror = () => reject(request.error);
        });
    }

    // Delete entire InformationSystem object
    public static async deleteInformationSystem(systemId: number): Promise<void> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.SYSTEMS_STORE_NAME], 'readwrite');
            const store = transaction.objectStore(this.SYSTEMS_STORE_NAME);
            const request = store.delete(`system_${systemId}`);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // Get all system IDs stored in IndexedDB
    public static async getAllSystemIds(): Promise<number[]> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.SYSTEMS_STORE_NAME], 'readonly');
            const store = transaction.objectStore(this.SYSTEMS_STORE_NAME);
            const request = store.getAllKeys();

            request.onsuccess = () => {
                const keys = request.result as string[];
                // Filter keys that start with 'system_' and extract IDs
                const systemIds = keys
                    .filter(key => typeof key === 'string' && key.startsWith('system_'))
                    .map(key => {
                        const idStr = (key as string).replace('system_', '');
                        const id = parseInt(idStr, 10);
                        return isNaN(id) ? null : id;
                    })
                    .filter(id => id !== null) as number[];
                resolve(systemIds);
            };
            request.onerror = () => reject(request.error);
        });
    }
}
