import { DatabaseWrapper } from '~/utils/DatabaseWrapper'

export default defineNuxtRouteMiddleware(async (to, from) => {

    // 1) Load systems from IndexedDB
    const result = await IndexedDbStorage.GetStoredInformationSystems()
    console.log(result.toString())
    const systemsStore = useSystemsStore()
    systemsStore.systems = result.data || []

    // 2) Check if system is selected
    if (to.params.id) {
        systemsStore.selectedSystemId = to.params.id as string
    }

    // 3) Check if system is initialized
    const system = systemsStore.getSystemById(systemsStore.selectedSystemId!)
    if (system && system.database) {
        if (!await DatabaseWrapper.isDatabaseInitialized(system.database)) {
            console.log("Initializing DB for system " + systemsStore.selectedSystemId)
            await system.database.initializeDatabase()
        }
    }
})