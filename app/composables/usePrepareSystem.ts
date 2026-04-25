import { DatabaseWrapper } from '~/utils/DatabaseWrapper'

export function usePrepareSystem() {
  const systemsStore = useSystemsStore()

  async function prepareSystem(id: string): Promise<boolean> {
    console.log('Preparing system ' + id)
    systemsStore.selectedSystemId = id

    const system = systemsStore.getSystemById(id)
    if (!system) {
      console.error('System not found for system ' + id)
      return false
    }

    if (!system.database) {
      console.error('System database not found for system ' + id)
      return false
    }

    if (!(await DatabaseWrapper.isDatabaseInitialized(system.database))) {
      console.log('Initializing DB for system ' + id)
      await system.database.initializeDatabase()
    }

    return true
  }

  return {
    prepareSystem,
  }
}
