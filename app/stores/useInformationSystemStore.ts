import { defineStore } from 'pinia'
import { InformationSystem } from '~/model/InformationSystem'
import { ref } from 'vue'
import { IndexedDbHandler } from '~/utils/IndexedDbHandler'

export const useInformationSystemStore = defineStore('informationSystem', () => {
  const systems = ref<InformationSystem[]>([])

  // Load all systems from IndexedDB
  const loadSystemsFromIndexedDB = async () => {
    try {
      console.log("Loading systems from IndexedDB...")
      const systemIds = await IndexedDbHandler.getAllSystemIds();
      console.log("Found system IDs in IndexedDB:", systemIds);

      for (const systemId of systemIds) {
        try {
          const system = await InformationSystem.loadFromIndexedDB(systemId);
          if (system) {
            // Check if system already exists in store to avoid duplicates
            const existingIndex = systems.value.findIndex(s => s.id === system.id);
            if (existingIndex === -1) {
              systems.value.push(system);
              console.log(`Loaded system ${system.name} from IndexedDB`);
            } else {
              console.log(`System ${system.name} already exists in store, skipping`);
            }
          }
        } catch (error) {
          console.error(`Failed to load system ${systemId} from IndexedDB:`, error);
        }
      }

      console.log(`Loaded ${systems.value.length} systems from IndexedDB`);
    } catch (error) {
      console.error('Failed to load systems from IndexedDB:', error)
    }
  }

  // Initialize systems from IndexedDB on store creation
  const initializeStore = async () => {
    await loadSystemsFromIndexedDB()
  }

  // Call initialization
  initializeStore()

  function addSystem(system: InformationSystem) {
    systems.value.push(system)
    // Save to IndexedDB when adding
    system.saveToIndexedDB().catch(e => console.error('Failed to save system to IndexedDB:', e))
  }

  function clearSystems() {
    // Delete all systems from IndexedDB before clearing the store
    const deletePromises = systems.value.map(system =>
      InformationSystem.deleteFromIndexedDB(system.id).catch(e =>
        console.error(`Failed to delete system ${system.id} from IndexedDB:`, e)
      )
    );
    Promise.all(deletePromises).finally(() => {
      systems.value = []
    });
  }

  function deleteSystem(systemId: number) {
    const index = systems.value.findIndex(sys => sys.id === systemId)
    if (index !== -1) {
      systems.value.splice(index, 1)
      // Delete from IndexedDB
      InformationSystem.deleteFromIndexedDB(systemId).catch(e => console.error('Failed to delete system from IndexedDB:', e))
    }
  }

  async function initializeDbs() {
    console.log("Reinitializing databases.")
    for (let i = 0; i < systems.value.length; i++) {
        systems.value[i].dbInitialized = false;
        const dbHandler = await InformationSystem.databaseInitStatic(systems.value[i].configData);
        
        systems.value[i].db = dbHandler;
        systems.value[i].dbInitialized = true;  
      }
  }

  async function loadComponentMaps() {
    console.log("Loading component maps for all systems.")
    for (let i = 0; i < systems.value.length; i++) {
      await systems.value[i].loadComponentMaps();
    }
  }

  return {
    systems,
    addSystem,
    clearSystems,
    deleteSystem,
    initializeDbs,
    loadComponentMaps,
    loadSystemsFromIndexedDB
  }
})
