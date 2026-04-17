import { Component } from '~/model/Component'

export default defineNuxtPlugin(async (_nuxtApp) => {
    const store = useComponentStore()
    
    const modules = import.meta.glob('~/model/SystemComponents/**/*.ts')
    for (const path in modules) {
        const mod: any = await modules[path]!()

        for (const key in mod) {
            const exportItem = mod[key]
            if (exportItem instanceof Component) {
                store.registerComponent(exportItem)
            }
        }
    }

    const systemsStore = useSystemsStore()
        for (const system of systemsStore.systems) {
            system.actualComponents = store.defaultComponents.map(c => Component.fromJSON(JSON.parse(JSON.stringify(c))))
        }
})