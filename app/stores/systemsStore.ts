import type { InformationSystem } from "~/model/InformationSystem"
import { IndexedDbStorage } from "~/utils/IndexedDbStorage"
import { Operation } from "~/utils/Operation"
import { OperationResultType } from "~/utils/OperationResultType"

import { emptyComponent } from "~/model/SystemComponents/EmptyComponent"

export const useSystemsStore = defineStore('systems', () => {

    const selectedSystemId = ref<string | null>(null)

    const selectedSystem = computed(() => {
        return systems.value.find(system => String(system.id) === String(selectedSystemId.value))
    })

    const getComponentById = (componentId: string) => {
        return selectedSystem.value?.actualComponents.find(c => c.id === componentId) ?? emptyComponent
    }

    const systems = ref<InformationSystem[]>([])

    const getSystemById = (id: string): InformationSystem | undefined => {
        return systems.value.find(system => String(system.id) === String(id))
    }

    async function deleteSystemById(id: string): Promise<Operation<null>> {
        const result = await IndexedDbStorage.DeleteInformationSystem(id)
        if (result.result === OperationResultType.SUCCESS) {
            systems.value = systems.value.filter(system => String(system.id) !== String(id))
        }
        return result
    }

    async function updateSystem(system: InformationSystem): Promise<Operation<null>> {
        const result = await IndexedDbStorage.UpdateInformationSystem(system)
        if (result.result === OperationResultType.SUCCESS) {
            const index = systems.value.findIndex(s => s.id === system.id)
            if (index !== -1) {
                systems.value[index] = system
            }
        }
        return result
    }

    async function addSystem(system: InformationSystem): Promise<Operation<null>> {
        const result = await IndexedDbStorage.SaveInformationSystem(system)
        if (result.result === OperationResultType.SUCCESS) {
            systems.value.push(system)
        }
        return result
    }

    return {
        systems,
        selectedSystem,
        selectedSystemId,
        addSystem,
        deleteSystemById,
        getSystemById,
        updateSystem,
        getComponentById,
    }

},
    {
        persist: true,
    }
)