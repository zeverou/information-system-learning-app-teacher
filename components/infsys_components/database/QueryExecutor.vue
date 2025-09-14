<template>
    <UCard>
        <UTextarea v-model="query" placeholder="Enter SQL query here..." :rows="6" class="mb-4 w-full" />
        <div class="mt-2">
            <UButton @click="executeQuery" color="primary">Execute Query</UButton>
            <UButton @click="clearResults" color="neutral" class="ml-2">Clear</UButton>
        </div>
        
        <div v-if="error" class="text-red-500 mt-4 p-2 bg-red-50 rounded">
            <strong>Error:</strong> {{ error }}
        </div>
        
        <div v-if="results.length > 0" class="mt-4">
            <h3 class="text-lg font-semibold mb-2">Query Results ({{ results.length }} rows)</h3>
            <div class="overflow-x-auto">
                <table class="min-w-full bg-white border border-black">
                    <thead>
                        <tr class="bg-gray-100">
                            <th v-for="key in Object.keys(results[0] || {})" :key="key" class="border border-black px-4 py-2 text-left text-black">
                                {{ key }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, index) in results" :key="index" class="hover:bg-gray-50">
                            <td v-for="key in Object.keys(row)" :key="key" class="border border-black px-4 py-2 text-black">
                                {{ row[key] }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        
        <div v-if="results.length === 0 && !error && queryExecuted" class="mt-4 text-gray-500">
            No results returned.
        </div>
    </UCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSelectedSystemStore } from '#imports';

const selectedSystemStore = useSelectedSystemStore();

const system = selectedSystemStore.selectedSystem;

const query = ref('')
const results = ref<any[]>([])
const error = ref('')
const queryExecuted = ref(false)

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
}
</script>