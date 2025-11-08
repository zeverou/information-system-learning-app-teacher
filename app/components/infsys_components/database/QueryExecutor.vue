<template>
    <UCard>
        <h2 style="font-weight: bolder; font-size: 1.5rem;">{{ $t('custom_query') }}</h2>
        <UTextarea v-model="query" :placeholder="$t('enter_sql_query')" :rows="6" class="mb-4 w-full" />
        <div class="mt-2">
            <UButton @click="executeQuery" color="primary">{{ $t('execute_query') }}</UButton>
            <UButton @click="clearResults" color="neutral" class="ml-2">{{ $t('clear') }}</UButton>
        </div>
        
        <div v-if="error" class="text-red-500 mt-4 p-2 bg-red-50 rounded">
            <strong>{{ $t('error') }}:</strong> {{ error }}
        </div>
        
        <div v-if="results.length > 0" class="mt-4">
            <h3 class="text-lg font-semibold mb-2">{{ $t('query_results') }} ({{ results.length }} {{ $t('rows') }})</h3>
            <table class="w-full border border-white" style="background-color: #0f172b;">
                <thead>
                    <tr style="background-color: #0f172b;">
                        <th v-for="key in Object.keys(results[0] || {})" :key="key" class="border border-white px-4 py-2 text-left text-white" style="background-color: #0f172b;">
                            {{ key }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, index) in paginatedResults" :key="index" class="hover:bg-gray-700" style="background-color: #0f172b;">
                        <td v-for="key in Object.keys(row)" :key="key" class="border border-white px-4 py-2 text-white" style="background-color: #0f172b;">
                            {{ row[key] }}
                        </td>
                    </tr>
                </tbody>
            </table>
            
            <!-- Pagination Controls -->
            <div v-if="totalPages > 1" class="mt-4 flex items-center justify-between">
                <div class="text-sm text-gray-300">
                    {{ $t('showing') }} {{ startIndex + 1 }} {{ $t('to') }} {{ endIndex }} {{ $t('of') }} {{ results.length }} {{ $t('results') }}
                </div>
                <div class="flex items-center gap-2">
                    <UButton 
                        @click="currentPage = Math.max(1, currentPage - 1)" 
                        :disabled="currentPage === 1"
                        size="sm"
                        color="neutral"
                        variant="outline"
                    >
                        {{ $t('previous') }}
                    </UButton>
                    
                    <span class="text-sm text-gray-300">
                        {{ $t('page') }} {{ currentPage }} {{ $t('of') }} {{ totalPages }}
                    </span>
                    
                    <UButton 
                        @click="currentPage = Math.min(totalPages, currentPage + 1)" 
                        :disabled="currentPage === totalPages"
                        size="sm"
                        color="neutral"
                        variant="outline"
                    >
                        {{ $t('next') }}
                    </UButton>
                </div>
            </div>
        </div>
        
        <div v-if="results.length === 0 && !error && queryExecuted" class="mt-4 text-gray-500">
            {{ $t('no_results') }}
        </div>
    </UCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSelectedSystemStore } from '#imports';

const selectedSystemStore = useSelectedSystemStore();

const system = selectedSystemStore.selectedSystem;

const query = ref('')
const results = ref<any[]>([])
const error = ref('')
const queryExecuted = ref(false)

// Pagination constants and state
const ROW_COUNT = 10 // Constant row count per page
const currentPage = ref(1)

// Computed properties for pagination
const totalPages = computed(() => Math.ceil(results.value.length / ROW_COUNT))

const paginatedResults = computed(() => {
    const start = (currentPage.value - 1) * ROW_COUNT
    const end = start + ROW_COUNT
    return results.value.slice(start, end)
})

const startIndex = computed(() => (currentPage.value - 1) * ROW_COUNT)
const endIndex = computed(() => Math.min(currentPage.value * ROW_COUNT, results.value.length))

function executeQuery() {
    if (!system?.db) {
        error.value = 'No database selected'
        return
    }
    try {
        const result = system.db.query(query.value)
        if (result.success) {
            results.value = result.results
            error.value = ''
            currentPage.value = 1 // Reset to first page when new results are loaded
        } else {
            error.value = 'Query failed'
        }
        queryExecuted.value = true
    } catch (e: any) {
        error.value = e.message
        queryExecuted.value = true
    }
}

function clearResults() {
    results.value = []
    error.value = ''
    queryExecuted.value = false
    currentPage.value = 1 // Reset to first page when results are cleared
    query.value = '' // Clear the query textarea
}
</script>