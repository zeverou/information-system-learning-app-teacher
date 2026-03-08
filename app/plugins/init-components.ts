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
})