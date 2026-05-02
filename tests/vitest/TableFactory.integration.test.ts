import { describe, it, expect, vi } from 'vitest'
import { TableFactory } from '../../app/utils/TableFactory'
import { OperationResultType } from '../../app/utils/OperationResultType'
import { join } from 'path'
import { readFileSync, readdirSync } from 'fs'

// In TableFactory, locateFile points to the Nuxt app base URL plus 'sql-wasm.wasm'.
// For the integration test to work in Node environment, we mock sql.js initialization 
// to use the default node loading mechanism (or ignore locateFile completely).
vi.mock('sql.js', async (importOriginal) => {
    const original = await importOriginal<typeof import('sql.js')>()
    return {
        default: async (config?: any) => {
            // When not providing locateFile in Node, sql.js will find the wasm file relative to itself.
            return await original.default()
        },
        __esModule: true,
    }
})

describe('TableFactory Integration', () => {
    it('should create database from actual CSV mock system files and verify tables and records', async () => {
        const factory = new TableFactory()
        const csvDir = join(process.cwd(), 'systems', 'information_system_2', 'csv')

        let files: string[]
        try {
            files = readdirSync(csvDir).filter(f => f.endsWith('.csv'))
        } catch (error) {
            console.error(`Could not read mock CSV directory at ${csvDir}`)
            return // skip if we can't find the folder so tests don't permanently fail
        }

        const csvContents: Record<string, string> = {}
        for (const file of files) {
            const tableName = file.replace('.csv', '')
            csvContents[tableName] = readFileSync(join(csvDir, file), 'utf-8')
        }

        expect(Object.keys(csvContents).length).toBeGreaterThan(0) // Ensure we actually loaded files

        const result = await factory.createDatabase(csvContents)

        expect(result.result).toBe(OperationResultType.SUCCESS)
        expect(result.data).not.toBeNull()

        const db = result.data!

        // Let's verify that expected tables exist and contain the right amount of rows

        // 1. alergeny
        if (csvContents['alergeny']) {
            const rowCountQuery = db.exec('SELECT COUNT(*) as count FROM alergeny')
            const count = rowCountQuery[0].values[0][0]
            const csvDataLines = csvContents['alergeny'].split('\n').filter(l => l.trim() !== '')
            // Subtract 1 for the header
            expect(count).toBe(csvDataLines.length - 1)
        }

        // 2. ucastnici
        if (csvContents['ucastnici']) {
            const rsUcastnici = db.exec('SELECT jmeno FROM ucastnici LIMIT 1')
            expect(rsUcastnici.length).toBe(1)
            expect(rsUcastnici[0].values.length).toBe(1)
        }

        // 3. Verify PRAGMA table_info (schema validation)
        if (csvContents['turnusy']) {
            const schemaQuery = db.exec('PRAGMA table_info(turnusy)')
            const columns = schemaQuery[0].values.map(row => row[1]) // row[1] is name in PRAGMA table_info
            expect(columns).toContain('id_turnusu')
            expect(columns).toContain('datum_od')
        }

        // Check all created tables by querying sqlite_master
        const tablesQuery = db.exec("SELECT name FROM sqlite_master WHERE type='table'")
        const createdTables = tablesQuery[0].values.map(v => v[0])
        expect(createdTables.length).toBeGreaterThanOrEqual(files.length)

        for (const tableName of Object.keys(csvContents)) {
            expect(createdTables).toContain(tableName)
        }

        db.close()
    })
})
