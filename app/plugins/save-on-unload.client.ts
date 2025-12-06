// plugins/save-on-unload.client.ts
import { useSelectedSystemStore } from '~/stores/useSelectedSystemStore'

export default defineNuxtPlugin(() => {
  if (process.client) {
    const selectedSystemStore = useSelectedSystemStore()

    const handleBeforeUnload = async () => {
      if (selectedSystemStore.selectedSystem) {
        try {
          await selectedSystemStore.selectedSystem.saveToIndexedDB()
          console.log('Database saved to IndexedDB before unload.')
        } catch (error) {
          console.error('Failed to save database before unload:', error)
        }
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
  }
})