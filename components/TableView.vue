<script setup lang="ts">
/* 1. Imports */
import { ref, computed, reactive, watch, h, resolveComponent, readonly, onMounted, type Ref } from 'vue'
import { useClipboard } from '@vueuse/core'
import type { TableColumn, DropdownMenuItem } from '@nuxt/ui'
import type { Column } from '@tanstack/vue-table'
import type { InformationSystem } from '~/model/InformationSystem'
//import { EditComponentModal } from '#components'
import { usePropertyStore } from '#imports'
import { useHighlightWatchers } from '~/composables/highlightWatchers'
// import '~/assets/css/highlight.css'
import { useHighlightStore } from '#imports'
import { useInformationSystemStore } from '~/stores/useInformationSystemStore'
import { useSelectedSystemStore } from '~/stores/useSelectedSystemStore'

/* 2. Stores */
const propertyStore = usePropertyStore()
const highlightStore = useHighlightStore()
const informationSystemStore = useInformationSystemStore()
const selectedSystemStore = useSelectedSystemStore()

/* 3. Context hooks */
const { t } = useI18n()
const toast = useToast()
const { copy } = useClipboard()

/* 4. Constants (non-reactive) */
const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const ROW_COUNT = 10 // Constant row count per page

/* 5. Props */
const props = defineProps<{
    tableNames: string[]
    selectedTableName: string
    selectedTableData: any[]
    columnNames: string[]
    columnTypes: string[]
    tableInfo: any[]
    columnValuesMap: Record<string, string[]>
    onSortChange?: (sortField: string, sortOrder: 'asc' | 'desc' | null) => void
    onFilterChange?: (filter: string) => void
    onTableSelect?: (tableName: string) => void
    onAdd?: () => void
    onEdit?: (row: any) => void
    onDelete?: (row: any) => void
}>()

/* 6. Computed */
const system = computed(() => {
    return informationSystemStore.systems.find(s => s.id === selectedSystemStore.selectedId) || null
})

/* 6. Emits */
const emit = defineEmits<{
    'table-select': [tableName: string]
    'add': []
    'edit': [row: any]
    'delete': [row: any]
    'open-editor': [column: any]
    'sort-change': [field: string, order: 'asc' | 'desc' | null]
    'filter-change': [filter: string]
}>()

/* 7. Local state (ref, reactive) */
const globalFilter = ref('')
const currentSort = ref<{
    field: string | null
    order: 'asc' | 'desc' | null
}>({
    field: null,
    order: null
})
const editingColumn = ref<string | null>(null)
const currentPage = ref(1) // Pagination state

/* 8. Computed */
const data = computed(() => {
    return props.selectedTableData
})

const autoColumns = computed<TableColumn<any>[]>(() => {
    const keys = props.columnNames
    console.log("KEYS:", keys)

    const columns: TableColumn<any>[] = keys.map(key => ({
        id: key,
        header: () => getHeader(key, key)
    }))

    console.log("COLUMNS:", columns)

    // remove columns: id, turnus_id, rodné_číslo
    // const filteredColumns = columns.filter(col => !['id', 'turnus_id', 'rodné_číslo'].includes(col.accessorKey || ''))

    // print data for column=Alergeny
    if (props.columnNames.includes('alergeny')) {
        console.log("Data for Alergeny:", data.value.map(row => row.Alergeny))
    }

    // Add action column at the end
    return [
        ...columns,
        {
            id: 'action',
            header: t('actions')
        }
    ]
})

const filteredAndSortedData = computed(() => {
    let d = [...data.value]

    // Apply filtering first
    if (globalFilter.value.trim()) {
        const filter = globalFilter.value.toLowerCase()
        d = d.filter(item => {
            return Object.values(item).some(value =>
                String(value).toLowerCase().includes(filter)
            )
        })
    }

    // Then apply sorting
    if (currentSort.value.field && currentSort.value.order) {
        d.sort((a, b) => {
            const field = currentSort.value.field!
            const aValue = a[field]
            const bValue = b[field]
            if (aValue == null && bValue == null) return 0
            if (aValue == null) return 1
            if (bValue == null) return -1
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return currentSort.value.order === 'asc' ? aValue - bValue : bValue - aValue
            }
            return currentSort.value.order === 'asc'
                ? String(aValue).localeCompare(String(bValue))
                : String(bValue).localeCompare(String(aValue))
        })
    }
    return d
})

// Computed properties for pagination
const totalPages = computed(() => Math.ceil(filteredAndSortedData.value.length / ROW_COUNT))

const paginatedResults = computed(() => {
    const start = (currentPage.value - 1) * ROW_COUNT
    const end = start + ROW_COUNT
    return filteredAndSortedData.value.slice(start, end)
})

const startIndex = computed(() => (currentPage.value - 1) * ROW_COUNT)
const endIndex = computed(() => Math.min(currentPage.value * ROW_COUNT, filteredAndSortedData.value.length))

const currentSqlQuery = computed(() => {
    if (!props.selectedTableName || props.columnNames.length === 0) return ''
    const columnList = props.columnNames.map(col => `"${col}"`).join(', ')
    return `SELECT ${columnList} FROM ${props.selectedTableName}`
})

/* 9. Watchers */
watch(globalFilter, (newFilter) => {
    emit('filter-change', newFilter)
    currentPage.value = 1 // Reset to first page when filter changes
}, { debounce: 300 })

useHighlightWatchers(highlightStore.highlightHandler, highlightStore)

/* 10. Methods */
// Add these new helper methods
function isArrayColumn(value: any): boolean {
    if (!value) return false

    // Check if it's already an array
    if (Array.isArray(value)) return true

    // Check if it's a string that looks like an array
    if (typeof value === 'string') {
        const trimmed = value.trim()
        return trimmed.startsWith('[') && trimmed.endsWith(']')
    }

    return false
}

function parseArrayData(value: any): string[] {
    if (!value) return []

    // If it's already an array, return it
    if (Array.isArray(value)) return value

    // If it's a string representation of an array, parse it
    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value)
            return Array.isArray(parsed) ? parsed : []
        } catch (error) {
            // If JSON parsing fails, try to split by comma (fallback)
            const trimmed = value.replace(/^\[|\]$/g, '').trim()
            if (trimmed) {
                return trimmed.split(',').map(item => item.trim().replace(/^"|"$/g, ''))
            }
        }
    }

    return []
}

function formatColumnName(field: string): string {
    // Convert snake_case or camelCase to Title Case
    return field
        .replace(/_/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/\b\w/g, l => l.toUpperCase())
}

function generateSqlWhere(filter: string, columns: string[]) {
    if (!filter.trim()) return ''

    const sanitizedFilter = filter.replace(/'/g, "''") // Escape single quotes
    const conditions = columns.map(col => {
        const sanitizedCol = col.replace(/[^a-zA-Z0-9_]/g, '')
        return `${sanitizedCol} LIKE '%${sanitizedFilter}%'`
    }).join(' OR ')

    return `WHERE (${conditions})`
}

function handleSort(field: string) {
    let newOrder: 'asc' | 'desc' | null = 'asc'

    if (currentSort.value.field === field) {
        // Cycle through: asc -> desc -> null
        if (currentSort.value.order === 'asc') {
            newOrder = 'desc'
        } else if (currentSort.value.order === 'desc') {
            newOrder = null
        }
    }

    currentSort.value = {
        field: newOrder ? field : null,
        order: newOrder
    }

    emit('sort-change', field, newOrder)

    // Generate SQL for debugging/logging
    if (newOrder) {
        const sqlOrderBy = generateSqlOrderBy(field, newOrder)
        console.log('Generated SQL ORDER BY:', sqlOrderBy)
    }
}

function getHeader(label: string, field: string) {
    const isCurrentField = currentSort.value.field === field
    const currentOrder = isCurrentField ? currentSort.value.order : null
    
    // Use formatted column name directly (no translation)
    const formattedLabel = formatColumnName(field)
    
    return h(
        'button',
        {
            class: [
                'sort-header',
                isCurrentField ? 'active' : '',
                currentOrder === 'asc' ? 'asc' : '',
                currentOrder === 'desc' ? 'desc' : ''
            ],
            onClick: () => handleSort(field),
            style: {
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: isCurrentField ? 'bold' : 'normal',
                color: isCurrentField ? '#2563EB' : 'inherit',
                outline: 'none',
                padding: '0',
            }
        },
        [
            formattedLabel,
            currentOrder === 'asc' ? ' \u25B2' : currentOrder === 'desc' ? ' \u25BC' : ''
        ]
    )
}

function getDropdownActions(row: any): DropdownMenuItem[] {
    return [
        {
            label: t('edit'),
            icon: 'i-lucide-edit',
            onSelect: () => emit('edit', row)
        },
        {
            label: t('delete'),
            icon: 'i-lucide-trash',
            color: 'red',
            onSelect: () => emit('delete', row)
        }
    ]
}

function getSqlQuery(baseQuery: string, columns: string[]) {
    let query = baseQuery

    // Add WHERE clause for filtering
    if (globalFilter.value.trim()) {
        const whereClause = generateSqlWhere(globalFilter.value, columns)
        if (whereClause) {
            query += ` ${whereClause}`
        }
    }

    // Add ORDER BY clause for sorting
    if (currentSort.value.field && currentSort.value.order) {
        const orderClause = generateSqlOrderBy(currentSort.value.field, currentSort.value.order)
        query += ` ${orderClause}`
    }

    return query
}

function addMethod() {
    emit('add')
}

function openEditorForColumn(col: any) {
    editingColumn.value = col.accessorKey || col.id
    // Instead of using showEditor, we'll use the highlightStore approach
    // The EditComponentModal will be shown based on highlightStore.isEditModeActive && highlightStore.selectedComponentId
    emit('open-editor', col)
}

function applyChanges() {
    // The applyChanges logic is now handled by the EditComponentModal component itself
    console.log('Changes applied via EditComponentModal')
}

function handleTableSelect(tableName: string) {
    emit('table-select', tableName)
    currentPage.value = 1 // Reset to first page when table changes
}

// Helper to detect array type
function isArrayType(type: string) {
    return type === 'array'
}

async function refreshDatabase() {
    try {
        await SystemReset.refreshDatabaseCore();
        // Preselect the first table after refresh to reload data
        if (props.tableNames.length > 0) {
            // TODO: This is not the best way to reflect the changes of refreshing the database
            /*
            When db refreshes the data are not reloaded and selecting other table is needed
            */
            window.location.reload();
            //emit('table-select', props.tableNames[0]);
        }
        toast.add({
            title: t('refresh_database_success') || 'Database refreshed successfully',
            color: 'primary',
            icon: 'i-lucide-check-circle'
        })
    } catch {
        toast.add({
            title: t('refresh_database_error') || 'Database refresh error',
            color: 'red',
            icon: 'i-lucide-alert-triangle'
        })
    }
}

/* Helper pro formátování ISO data na DD.MM.YYYY */
function formatDate(dateStr: string): string {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()}`
}

/* Helper pro výpočet délky v dnech mezi dvěma daty */
function getDaysLength(from: string, to: string): number | '' {
    if (!from || !to) return ''
    const d1 = new Date(from)
    const d2 = new Date(to)
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return ''
    // Zaokrouhlit na celé dny
    return Math.max(0, Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)))
}

/* 11. Lifecycle */
onMounted(() => {
    const highlightStore = useHighlightStore()
    console.log("HIGHLIGHT  ON:", highlightStore.isHighlightMode)
    console.log(highlightStore.highlightHandler.getHighlightedElements)
})

/* 12. defineExpose */
defineExpose({
    getSqlQuery,
    currentSort: readonly(currentSort),
    globalFilter: readonly(globalFilter)
})
</script>

<template>
    <div>
        <h1 class="text-4xl font-bold mb-4 pl-4">{{ t('database') }}</h1>

        <div class="flex flex-row items-center justify-between w-full px-4 py-2">
            <!-- Left side: Table Selector -->
            <div class="flex items-center gap-2" id="database-select-table">
                <USelect size="xl" :model-value="selectedTableName" :items="tableNames" class="w-48"
                    @update:model-value="handleTableSelect" />
                <UButton size="xl" :label="$t('refresh_database')" color="primary" variant="outline"
                    icon="i-heroicons-arrow-path" @click="refreshDatabase" />
            </div>

            <!-- Right side: Add Button, Global Filter Input, Refresh Button -->
            <div class="flex items-center gap-4">
                <!--
                <UButton size="xl" variant="subtle" @click="addMethod">{{ t('add_entity') }}</UButton>
                -->
                <div id="database-filter">
                    <UInput size="xl" :disabled="highlightStore.isHighlightMode" v-model="globalFilter" class="max-w-sm"
                        :placeholder="`${t('filter')} ${selectedTableName || 'items'}...`" />
                </div>


            </div>
        </div>

        <!-- Replace UTable with native HTML table -->
        <UCard>
            <table class="w-full border border-white" style="background-color: #0f172b;">
                <thead>
                    <tr style="background-color: #0f172b;">
                        <th v-for="col in autoColumns.filter(col => col.id !== 'action')" :key="col.id"
                            class="border border-white px-4 py-2 text-left text-white" style="background-color: #0f172b;">
                            <span :id="`table-${col.id}`" v-if="typeof col.header === 'function'">
                                <component :is="col.header()" />
                            </span>
                            <span v-else :id="`table-${col.id}`">
                                {{ col.header }}
                            </span>
                        </th>
                        <th v-if="columnNames.includes('od') && columnNames.includes('do')"
                            class="border border-white px-4 py-2 text-left text-white" style="background-color: #0f172b;">
                            {{ t('days_count') }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, rowIndex) in paginatedResults" :key="row.id || rowIndex"
                        class="hover:bg-gray-700" style="background-color: #0f172b;">

                        <td v-for="col in autoColumns.filter(col => col.id !== 'action')" :key="col.id"
                            class="border border-white px-4 py-2 text-white" style="background-color: #0f172b;">
                            <!-- Formátování pro sloupce 'od' a 'do' -->
                            <template v-if="col.id === 'od' || col.id === 'do'">
                                {{ formatDate(row[col.id!]) }}
                            </template>
                            <!-- Special rendering for array data columns (like roles, alergeny, etc.) -->
                            <template v-else-if="isArrayColumn(row[col.id!])">
                                <div class="flex flex-wrap gap-1">
                                    <UBadge v-for="(item, index) in parseArrayData(row[col.id!])" :key="index"
                                        size="md">
                                        {{ item }}
                                    </UBadge>
                                </div>
                            </template>
                            <!-- Default rendering for other columns -->
                            <template v-else>
                                {{ row[col.id!] }}
                            </template>
                        </td>
                        <!-- Nový sloupec 'délka' -->
                        <td v-if="columnNames.includes('od') && columnNames.includes('do')" class="border border-white px-4 py-2 text-white" style="background-color: #0f172b;">
                            {{ getDaysLength(row['od'], row['do']) }}
                        </td>
                        <!--
                        <td v-if="autoColumns.some(col => col.id === 'action')" class="px-4 py-2">
                            <UDropdownMenu :items="getDropdownActions(row)">
                                <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost"
                                    aria-label="Actions" />
                            </UDropdownMenu>
                        </td>
                        -->
                    </tr>
                    <tr v-if="paginatedResults.length === 0">
                        <td :colspan="autoColumns.filter(col => col.id !== 'action').length + (columnNames.includes('od') && columnNames.includes('do') ? 1 : 0)" class="text-center text-gray-400 py-4">
                            {{ t('no_data') }}
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Pagination Controls -->
            <div v-if="totalPages > 1" class="mt-4 flex items-center justify-between">
                <div class="text-sm text-gray-300">
                    {{ t('showing') }} {{ startIndex + 1 }} {{ t('to') }} {{ endIndex }} {{ t('of') }} {{ filteredAndSortedData.length }} {{ t('results') }}
                </div>
                <div class="flex items-center gap-2">
                    <UButton 
                        @click="currentPage = Math.max(1, currentPage - 1)" 
                        :disabled="currentPage === 1"
                        size="sm"
                        color="neutral"
                        variant="outline"
                    >
                        {{ t('previous') }}
                    </UButton>
                    
                    <span class="text-sm text-gray-300">
                        {{ t('page') }} {{ currentPage }} {{ t('of') }} {{ totalPages }}
                    </span>
                    
                    <UButton 
                        @click="currentPage = Math.min(totalPages, currentPage + 1)" 
                        :disabled="currentPage === totalPages"
                        size="sm"
                        color="neutral"
                        variant="outline"
                    >
                        {{ t('next') }}
                    </UButton>
                </div>
            </div>
        </UCard>

        <!--<EditComponentModal v-if="highlightStore.isEditModeActive && highlightStore.selectedComponentId" />-->
    </div>
</template>

<style scoped>
.sort-header {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    transition: color 0.2s;
}

.sort-header.active {
    color: #2563EB;
    font-weight: bold;
}

.sort-header.asc:after {
    content: ' \u25B2';
}

.sort-header.desc:after {
    content: ' \u25BC';
}
</style>