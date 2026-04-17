export default defineNuxtPlugin((_nuxtApp) => {
    const systemsStore = useSystemsStore()
    const globalSettings = useGlobalSettingsStore()

    const sync = () => {
        const tasks = systemsStore.selectedSystem?.tasks ?? []
        const solved = new Set(globalSettings.solvedComponentIds)
        const ids = new Set<string>()

        for (const task of tasks) {
            for (const component of task.errorComponents ?? []) {
                if (!solved.has(component.id)) {
                    ids.add(component.id)
                }
            }
        }

        globalSettings.errorComponentIds = Array.from(ids)
    }

    watch(
        () => [
            systemsStore.selectedSystemId,
            (systemsStore.selectedSystem?.tasks ?? []).flatMap(task =>
                (task.errorComponents ?? []).map(component => String(component.id))
            ),
            [...(globalSettings.solvedComponentIds ?? [])].map(id => String(id)),
        ] as const,
        sync,
        { immediate: true }
    )
})
