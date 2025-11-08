import { defineStore } from 'pinia'
import { InformationSystem } from '~/model/InformationSystem'
import { ref } from 'vue'
import { sys } from 'typescript'

export const useInformationSystemStore = defineStore('informationSystem', () => {
  const systems = ref<InformationSystem[]>([])

  function addSystem(system: InformationSystem) {
    systems.value.push(system)
  }

  function clearSystems() {
    systems.value = []
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

  return {
    systems,
    addSystem,
    clearSystems,
    initializeDbs
  }
}, {
  persist: {
    afterHydrate: async (context) => {
      await context.store.initializeDbs()
    }
  }
})
