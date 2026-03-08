<template>
    <div class="p-6">
        <div class="flex items-center gap-2 mb-6">
            <UBadge color="neutral" variant="subtle" size="lg">
                <span>Tables: {{ tableNames.length }}</span>
            </UBadge>
            <UBadge :color="isDbReady ? 'green' : 'red'" variant="subtle" size="lg">
                <span>Ready: {{ isDbReady ? 'Yes' : 'No' }}</span>
            </UBadge>
            <UButton v-if="!isDbReady" @click="handleCheckReady" icon="i-heroicons-shield-check" color="sky"
                variant="soft" size="sm" :loading="isChecking">
                Check Status
            </UButton>
            <UButton v-if="!isDbReady" @click="handleInitialize" icon="i-heroicons-arrow-path" color="teacher"
                variant="soft" size="sm" :loading="isInitializing">
                Initialize Database
            </UButton>
        </div>

        <div v-if="isDbReady" class="flex flex-col gap-4">
            <div class="flex items-center gap-2">
                <USelect color="neutral" v-model="value" :items="tableNames" placeholder="Select a table"
                    class="w-64" />
                <UButton icon="i-heroicons-chevron-left" variant="soft" color="neutral" size="sm"
                    :disabled="tablePage <= 1" @click="tablePage--" />
                <span class="text-sm text-gray-500 whitespace-nowrap">{{ tablePage }} / {{ tableTotalPages }}</span>
                <UButton icon="i-heroicons-chevron-right" variant="soft" color="neutral" size="sm"
                    :disabled="tablePage >= tableTotalPages" @click="tablePage++" />
                <span class="text-xs text-gray-400 whitespace-nowrap">{{ tableRowCount }} row{{ tableRowCount === 1 ? ''
                    : 's' }}</span>
            </div>
            <div class="h-[420px] overflow-y-auto">
                <DatabaseTable v-if="value" :queryResult="tableQueryResult" :page="tablePage" :tableName="value"
                    @update:totalPages="tableTotalPages = $event" @update:rowCount="tableRowCount = $event" />
            </div>
        </div>

        <div v-else
            class="flex flex-col items-center justify-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <UIcon name="i-lucide-database-zap" class="w-12 h-12 text-gray-400 mb-4" />
            <p class="text-gray-500 dark:text-gray-400 font-medium">Database is not ready or being initialized...</p>
        </div>

        <USeparator class="my-4" />

        <!-- Query Execution -->
        <div class="flex flex-col gap-4">
            <CodeBlock v-model:code="query" language="sql" label="SQL Query" height="125px" />
            <div class="flex justify-between items-center">
                <UBadge :color="isQueryValid ? 'green' : 'red'" variant="subtle" size="lg">
                    <span class="flex items-center gap-1">
                        <UIcon :name="isQueryValid ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'"
                            class="w-5 h-5" />
                        {{ isQueryValid ? 'Valid SQL' : 'Invalid SQL' }}
                    </span>
                </UBadge>
                <UButton @click="handleExecuteQuery" icon="i-heroicons-arrow-path" color="teacher" variant="soft"
                    size="lg" :loading="isExecuting" :disabled="!isQueryValid">
                    Execute Query
                </UButton>
            </div>
            <DatabaseTable v-if="queryResult !== null" :queryResult="queryResult" :page="queryPage"
                @update:totalPages="queryTotalPages = $event" @update:rowCount="queryRowCount = $event" />
            <div v-if="queryResult !== null" class="flex items-center gap-2">
                <UButton icon="i-heroicons-chevron-left" variant="soft" color="neutral" size="sm"
                    :disabled="queryPage <= 1" @click="queryPage--" />
                <span class="text-sm text-gray-500 whitespace-nowrap">{{ queryPage }} / {{ queryTotalPages }}</span>
                <UButton icon="i-heroicons-chevron-right" variant="soft" color="neutral" size="sm"
                    :disabled="queryPage >= queryTotalPages" @click="queryPage++" />
                <span class="text-xs text-gray-400 whitespace-nowrap">{{ queryRowCount }} row{{ queryRowCount === 1 ? ''
                    : 's' }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { SqlHandler } from '~/core/SqlHandler'
import { useSystemsStore } from '~/stores/systemsStore'
import { DatabaseHandler } from '~/utils/DatabaseHandler'
import { DatabaseWrapper } from '~/utils/DatabaseWrapper'
import { OperationResultType } from '~/utils/OperationResultType'

const route = useRoute()
const systemsStore = useSystemsStore()



// Ensure selectedSystemId is set if navigating directly
if (!systemsStore.selectedSystemId && route.params.id) {
    systemsStore.selectedSystemId = route.params.id as string
}

const tableNames = ref<string[]>([])
// default = 1st table
const value = ref(tableNames.value[0])
const tableQueryResult = ref<Awaited<ReturnType<typeof DatabaseHandler.query>> | null>(null)
const tablePage = ref(1)
const tableTotalPages = ref(1)
const tableRowCount = ref(0)

watch(value, async (tableName) => {
    tableQueryResult.value = null
    tablePage.value = 1
    if (!tableName) return
    const db = systemsStore.selectedSystem?.database?.sqlJsDatabase
    if (!db) return
    tableQueryResult.value = await DatabaseHandler.query(db, `SELECT * FROM "${tableName}"`)
    console.log("Table query result: ", tableQueryResult.value)
})
const isDbReady = ref(false)
const isInitializing = ref(false)
const isChecking = ref(false)

const query = ref('')

const isQueryValid = ref(false)

watch(query, async (newQuery) => {
    if (!newQuery || newQuery.trim() === '') {
        isQueryValid.value = false
        return
    }
    const system = systemsStore.selectedSystem
    if (system?.database?.sqlJsDatabase) {
        const result = await DatabaseHandler.isSqlValid(system.database.sqlJsDatabase, newQuery)
        isQueryValid.value = result.result === OperationResultType.SUCCESS
    } else {
        isQueryValid.value = false
    }
}, { immediate: true })

const isExecuting = ref(false)
const queryResult = ref<Awaited<ReturnType<typeof DatabaseHandler.query>> | null>(null)
const queryPage = ref(1)
const queryTotalPages = ref(1)
const queryRowCount = ref(0)

async function handleExecuteQuery() {
    if (!query.value) return
    isExecuting.value = true
    queryResult.value = null
    queryPage.value = 1
    try {
        const system = systemsStore.selectedSystem
        if (system && system.database) {
            queryResult.value = await DatabaseHandler.query(system.database.sqlJsDatabase, query.value)
            console.log("Query result: ", queryResult.value);
            if (queryResult.value.data && queryResult.value.data.length > 0) {
                console.log("Query result[0]: ", (queryResult.value.data[0] as any).lc);
            }

            const tableColumnMapResult = await DatabaseHandler.getTableColumnMap(system.database.sqlJsDatabase);
            const x = SqlHandler.GetSqlVariableNames(query.value, tableColumnMapResult.data ?? {}, queryResult.value.data ?? []);
            console.log("Len: ", x.length)
            for (const variable of x) {
                console.log(variable.toString())
            }

            const isMutation = /^\s*(?:DROP|CREATE|ALTER|INSERT|UPDATE|DELETE|REPLACE)\b/i.test(query.value);
            if (isMutation) {
                await loadDatabaseInfo();
                await systemsStore.updateSystem(system);
            }
        }
    } finally {
        isExecuting.value = false
    }
}

async function handleCheckReady() {
    const system = systemsStore.selectedSystem
    console.log("Is system missing: ", !system)
    console.log("Is database missing: ", !system?.database)
}

async function handleInitialize() {
    const system = systemsStore.selectedSystem
    if (system && system.database) {
        isInitializing.value = true
        try {
            await system.database.initializeDatabase()
            await loadDatabaseInfo()
        } catch (error) {
            console.error("Failed to initialize database", error)
        } finally {
            isInitializing.value = false
        }
    }
}

/**
 * Loads database information including ready status and table names.
 */
const loadDatabaseInfo = async () => {
    const system = systemsStore.selectedSystem
    if (system && system.database) {
        // Use the databaseWrapper method to check if ready
        isDbReady.value = await DatabaseWrapper.isDatabaseInitialized(system.database)

        if (isDbReady.value && system.database.sqlJsDatabase) {
            const result = await DatabaseHandler.getTableNames(system.database.sqlJsDatabase)
            if (result.result === OperationResultType.SUCCESS && result.data) {
                tableNames.value = result.data
                if (!value.value) value.value = result.data[0]
            } else {
                tableNames.value = []
            }
        } else {
            tableNames.value = []
        }
    } else {
        isDbReady.value = false
        tableNames.value = []
    }
}

// Reactively update info when selected system or database state changes
watch(() => systemsStore.selectedSystem?.database, loadDatabaseInfo, { immediate: true })

// Watch for manual database initialization triggers (dbNumber increment)
watch(() => systemsStore.selectedSystem?.database?.dbNumber, loadDatabaseInfo)

</script>
