import { describe, it, expect, vi, beforeEach } from 'vitest'
import { OperationResultType } from '../../app/utils/OperationResultType'

// ---------- Dexie mock ----------
// We mock the db table methods so no real IndexedDB is touched.
const mockToCollection = vi.fn()
const mockToArray = vi.fn()
const mockGet = vi.fn()
const mockPut = vi.fn()
const mockDelete = vi.fn()

vi.mock('dexie', () => {
    class MockDexie {
        version(_v: any) {
            return {
                stores: (_schema: any) => {
                    // Assign AFTER AppDatabase's class-field initializer (systems! = void 0)
                    // so it isn't overwritten
                    (this as any).systems = {
                        toCollection: mockToCollection,
                        toArray: mockToArray,
                        get: mockGet,
                        put: mockPut,
                        delete: mockDelete,
                    }
                }
            }
        }
    }
    return { default: MockDexie }
})

// Import AFTER the mock is set up
const { IndexedDbStorage } = await import('../../app/utils/IndexedDbStorage')

// ---------- helpers ----------
function makeFakeRecord(id = '1') {
    return {
        id,
        name: 'Test System',
        language: 'cs',
        description: 'Test description',
        pages: [],
        tasks: [],
        actualComponents: [],
        defaultComponents: [],
        databaseBinary: null,
        score: null,
    }
}

// ---------- tests ----------
beforeEach(() => {
    vi.clearAllMocks()
})

describe('IndexedDbStorage.GetStoredInformationSystemsIds', () => {
    it('returns SUCCESS with ids on success', async () => {
        const fakeKeys = ['1', '2', '3']
        mockToCollection.mockReturnValue({ primaryKeys: async () => fakeKeys })

        const result = await IndexedDbStorage.GetStoredInformationSystemsIds()

        expect(result.result).toBe(OperationResultType.SUCCESS)
        expect(result.data).toEqual(fakeKeys)
    })

    it('returns ERROR when Dexie throws', async () => {
        mockToCollection.mockReturnValue({ primaryKeys: async () => { throw new Error('db error') } })

        const result = await IndexedDbStorage.GetStoredInformationSystemsIds()

        expect(result.result).toBe(OperationResultType.ERROR)
        expect(result.message).toContain('db error')
    })
})

describe('IndexedDbStorage.GetStoredInformationSystems', () => {
    it('returns SUCCESS with mapped InformationSystem instances', async () => {
        mockToArray.mockResolvedValue([makeFakeRecord('1'), makeFakeRecord('2')])

        const result = await IndexedDbStorage.GetStoredInformationSystems()

        expect(result.result).toBe(OperationResultType.SUCCESS)
        expect(result.data).toHaveLength(2)
        expect(result.data![0].id).toBe('1')
        expect(result.data![1].id).toBe('2')
    })

    it('returns SUCCESS with empty array when no records', async () => {
        mockToArray.mockResolvedValue([])

        const result = await IndexedDbStorage.GetStoredInformationSystems()

        expect(result.result).toBe(OperationResultType.SUCCESS)
        expect(result.data).toEqual([])
    })

    it('returns ERROR when Dexie throws', async () => {
        mockToArray.mockRejectedValue(new Error('db error'))

        const result = await IndexedDbStorage.GetStoredInformationSystems()

        expect(result.result).toBe(OperationResultType.ERROR)
        expect(result.message).toContain('db error')
    })
})

describe('IndexedDbStorage.SaveInformationSystem', () => {
    it('returns SUCCESS when system is saved without a database', async () => {
        mockPut.mockResolvedValue(undefined)
        const { InformationSystem } = await import('../../app/model/InformationSystem')
        const sys = new InformationSystem({ id: '1', name: 'Test', language: 'cs', description: 'Desc' })

        const result = await IndexedDbStorage.SaveInformationSystem(sys)

        expect(result.result).toBe(OperationResultType.SUCCESS)
        expect(mockPut).toHaveBeenCalledOnce()
    })

    it('exports sqlJsDatabase when present', async () => {
        mockPut.mockResolvedValue(undefined)
        const { InformationSystem } = await import('../../app/model/InformationSystem')
        const { DatabaseWrapper } = await import('../../app/utils/DatabaseWrapper')
        const fakeExport = new Uint8Array([1, 2, 3])
        const fakeDb = { export: () => fakeExport.buffer } as any
        const sys = new InformationSystem({ id: '2', name: 'T', language: 'en', description: 'D' })
        sys.database = DatabaseWrapper.fromInstance(fakeDb)

        const result = await IndexedDbStorage.SaveInformationSystem(sys)

        expect(result.result).toBe(OperationResultType.SUCCESS)
        const savedRecord = mockPut.mock.calls[0][0]
        expect(savedRecord.databaseBinary).toBeInstanceOf(Uint8Array)
    })

    it('uses binaryData when sqlJsDatabase is null', async () => {
        mockPut.mockResolvedValue(undefined)
        const { InformationSystem } = await import('../../app/model/InformationSystem')
        const { DatabaseWrapper } = await import('../../app/utils/DatabaseWrapper')
        const binary = new Uint8Array([9, 8, 7])
        const sys = new InformationSystem({ id: '3', name: 'T', language: 'en', description: 'D' })
        sys.database = DatabaseWrapper.fromBinary(binary)

        const result = await IndexedDbStorage.SaveInformationSystem(sys)

        expect(result.result).toBe(OperationResultType.SUCCESS)
        const savedRecord = mockPut.mock.calls[0][0]
        expect(savedRecord.databaseBinary).toBe(binary)
    })

    it('returns ERROR when Dexie throws', async () => {
        mockPut.mockRejectedValue(new Error('write error'))
        const { InformationSystem } = await import('../../app/model/InformationSystem')
        const sys = new InformationSystem({ id: '4', name: 'T', language: 'en', description: 'D' })

        const result = await IndexedDbStorage.SaveInformationSystem(sys)

        expect(result.result).toBe(OperationResultType.ERROR)
        expect(result.message).toContain('write error')
    })
})

describe('IndexedDbStorage.LoadInformationSystem', () => {
    it('returns SUCCESS with InformationSystem when record found', async () => {
        mockGet.mockResolvedValue(makeFakeRecord('42'))

        const result = await IndexedDbStorage.LoadInformationSystem('42')

        expect(result.result).toBe(OperationResultType.SUCCESS)
        expect(result.data!.id).toBe('42')
        expect(result.data!.name).toBe('Test System')
        expect(result.data!.pages).toEqual([])
    })

    it('attaches DatabaseWrapper when databaseBinary is present', async () => {
        const record = { ...makeFakeRecord('5'), databaseBinary: new Uint8Array([1, 2]) }
        mockGet.mockResolvedValue(record)

        const result = await IndexedDbStorage.LoadInformationSystem('5')

        expect(result.result).toBe(OperationResultType.SUCCESS)
        expect(result.data!.database).toBeDefined()
    })

    it('returns FAILED when record not found', async () => {
        mockGet.mockResolvedValue(undefined)

        const result = await IndexedDbStorage.LoadInformationSystem('missing')

        expect(result.result).toBe(OperationResultType.FAILED)
        expect(result.message).toContain('missing')
    })

    it('returns ERROR when Dexie throws', async () => {
        mockGet.mockRejectedValue(new Error('read error'))

        const result = await IndexedDbStorage.LoadInformationSystem('x')

        expect(result.result).toBe(OperationResultType.ERROR)
        expect(result.message).toContain('read error')
    })
})

describe('IndexedDbStorage.UpdateInformationSystem', () => {
    it('returns SUCCESS when system exists and is updated', async () => {
        mockGet.mockResolvedValue(makeFakeRecord('1'))
        mockPut.mockResolvedValue(undefined)
        const { InformationSystem } = await import('../../app/model/InformationSystem')
        const sys = new InformationSystem({ id: '1', name: 'Updated', language: 'en', description: 'D' })

        const result = await IndexedDbStorage.UpdateInformationSystem(sys)

        expect(result.result).toBe(OperationResultType.SUCCESS)
        expect(mockPut).toHaveBeenCalledOnce()
    })

    it('returns FAILED when system does not exist', async () => {
        mockGet.mockResolvedValue(undefined)
        const { InformationSystem } = await import('../../app/model/InformationSystem')
        const sys = new InformationSystem({ id: 'ghost', name: 'X', language: 'en', description: 'D' })

        const result = await IndexedDbStorage.UpdateInformationSystem(sys)

        expect(result.result).toBe(OperationResultType.FAILED)
        expect(result.message).toContain('ghost')
        expect(mockPut).not.toHaveBeenCalled()
    })

    it('returns ERROR when Dexie throws on get', async () => {
        mockGet.mockRejectedValue(new Error('db failure'))
        const { InformationSystem } = await import('../../app/model/InformationSystem')
        const sys = new InformationSystem({ id: '1', name: 'X', language: 'en', description: 'D' })

        const result = await IndexedDbStorage.UpdateInformationSystem(sys)

        expect(result.result).toBe(OperationResultType.ERROR)
        expect(result.message).toContain('db failure')
    })

    it('returns ERROR when Dexie throws on put', async () => {
        mockGet.mockResolvedValue(makeFakeRecord('1'))
        mockPut.mockRejectedValue(new Error('write failure'))
        const { InformationSystem } = await import('../../app/model/InformationSystem')
        const sys = new InformationSystem({ id: '1', name: 'X', language: 'en', description: 'D' })

        const result = await IndexedDbStorage.UpdateInformationSystem(sys)

        expect(result.result).toBe(OperationResultType.ERROR)
        expect(result.message).toContain('write failure')
    })
})

describe('IndexedDbStorage.DeleteInformationSystem', () => {
    it('returns SUCCESS when deleted', async () => {
        mockDelete.mockResolvedValue(undefined)

        const result = await IndexedDbStorage.DeleteInformationSystem('1')

        expect(result.result).toBe(OperationResultType.SUCCESS)
        expect(mockDelete).toHaveBeenCalledWith('1')
    })

    it('returns ERROR when Dexie throws', async () => {
        mockDelete.mockRejectedValue(new Error('delete error'))

        const result = await IndexedDbStorage.DeleteInformationSystem('1')

        expect(result.result).toBe(OperationResultType.ERROR)
        expect(result.message).toContain('delete error')
    })
})
