import { describe, it, expect, vi, beforeEach } from 'vitest'
import { OperationResultType } from '../../app/utils/OperationResultType'

// ---------- In-memory Dexie mock ----------
// Acts as a real store so the full save → get → delete pipeline is stateful.
const inMemoryStore = new Map<string, any>()

vi.mock('dexie', () => {
    class MockDexie {
        version(_v: any) {
            return {
                stores: (_schema: any) => {
                    ;(this as any).systems = {
                        toCollection: () => ({
                            primaryKeys: async () => [...inMemoryStore.keys()],
                        }),
                        toArray: async () => [...inMemoryStore.values()],
                        get: async (id: string) => inMemoryStore.get(id),
                        put: async (record: any) => { inMemoryStore.set(record.id, record) },
                        delete: async (id: string) => { inMemoryStore.delete(id) },
                    }
                },
            }
        }
    }
    return { default: MockDexie }
})

const { IndexedDbStorage } = await import('../../app/utils/IndexedDbStorage')
const { InformationSystem } = await import('../../app/model/InformationSystem')

// ---------- helpers ----------
function makeMockSystem(id = 'integration-1') {
    return new InformationSystem({
        id,
        name: 'Integration System',
        language: 'cs',
        description: 'Used for integration pipeline test',
    })
}

beforeEach(() => {
    inMemoryStore.clear()
})

// ---------- tests ----------
describe('IndexedDbStorage integration – save → get → delete pipeline', () => {

    it('saved system can be found by id in GetStoredInformationSystemsIds', async () => {
        const sys = makeMockSystem('pipe-1')

        const saveResult = await IndexedDbStorage.SaveInformationSystem(sys)
        expect(saveResult.result).toBe(OperationResultType.SUCCESS)

        const idsResult = await IndexedDbStorage.GetStoredInformationSystemsIds()
        expect(idsResult.result).toBe(OperationResultType.SUCCESS)
        expect(idsResult.data).toContain('pipe-1')
    })

    it('loaded system matches the saved one', async () => {
        const sys = makeMockSystem('pipe-2')

        await IndexedDbStorage.SaveInformationSystem(sys)

        const loadResult = await IndexedDbStorage.LoadInformationSystem('pipe-2')
        expect(loadResult.result).toBe(OperationResultType.SUCCESS)
        expect(loadResult.data!.id).toBe('pipe-2')
        expect(loadResult.data!.name).toBe('Integration System')
        expect(loadResult.data!.description).toBe('Used for integration pipeline test')
        expect(loadResult.data!.language).toBe('cs')
    })

    it('deleted system is no longer present', async () => {
        const sys = makeMockSystem('pipe-3')

        await IndexedDbStorage.SaveInformationSystem(sys)

        const deleteResult = await IndexedDbStorage.DeleteInformationSystem('pipe-3')
        expect(deleteResult.result).toBe(OperationResultType.SUCCESS)

        const loadResult = await IndexedDbStorage.LoadInformationSystem('pipe-3')
        expect(loadResult.result).toBe(OperationResultType.FAILED)

        const idsResult = await IndexedDbStorage.GetStoredInformationSystemsIds()
        expect(idsResult.data).not.toContain('pipe-3')
    })

    it('full pipeline: save → id check → load → delete → no longer present', async () => {
        const sys = makeMockSystem('pipe-full')

        // 1. Save
        const saveResult = await IndexedDbStorage.SaveInformationSystem(sys)
        expect(saveResult.result).toBe(OperationResultType.SUCCESS)

        // 2. Id check – system is in the store
        const idsAfterSave = await IndexedDbStorage.GetStoredInformationSystemsIds()
        expect(idsAfterSave.result).toBe(OperationResultType.SUCCESS)
        expect(idsAfterSave.data).toContain('pipe-full')

        // 3. Load – it is the same system
        const loadResult = await IndexedDbStorage.LoadInformationSystem('pipe-full')
        expect(loadResult.result).toBe(OperationResultType.SUCCESS)
        expect(loadResult.data!.id).toBe('pipe-full')
        expect(loadResult.data!.name).toBe(sys.name)

        // 4. Delete
        const deleteResult = await IndexedDbStorage.DeleteInformationSystem('pipe-full')
        expect(deleteResult.result).toBe(OperationResultType.SUCCESS)

        // 5. Id check – system is gone
        const idsAfterDelete = await IndexedDbStorage.GetStoredInformationSystemsIds()
        expect(idsAfterDelete.data).not.toContain('pipe-full')

        // 6. Load attempt – FAILED, not ERROR
        const loadAfterDelete = await IndexedDbStorage.LoadInformationSystem('pipe-full')
        expect(loadAfterDelete.result).toBe(OperationResultType.FAILED)
    })

})
