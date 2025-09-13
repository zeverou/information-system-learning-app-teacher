<template>
    <div class="when-served-menu">
        <label for="when-served-select" class="block text-sm font-medium text-gray-700 mb-2">
            {{ t('filter_by_when_served') }}
        </label>
        <USelect id="when-served-select" v-model="selectedValue" :options="whenServedOptions"
            :placeholder="t('all_meals')" :key="optionsKey" class="w-64" :items="whenServedOptions" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSelectedSystemStore } from '~/stores/useSelectedSystemStore'
import { useComponentCodeStore } from '#imports'
import { Component } from '~/model/Component'
import { ComponentHandler } from '~/composables/ComponentHandler'
import { useHighlightStore } from '~/stores/useHighlightStore'


const { t } = useI18n()
const selectedSystemStore = useSelectedSystemStore()
const componentCodeStore = useComponentCodeStore()
const highlightStore = useHighlightStore()
// Props
const props = defineProps<{
    selectedWhenServed: string
}>()

/* TODO: use USelect */
/*
const filterSessionsItems = computed(() => [
    { label: t('all_sessions'), value: 'all' },
    ...sessions.value.map(session => ({
        label: formatDateRange(session.fromDate, session.toDate),
        value: session.id
    }))
])
*/


const value = ''

// Emits
const emit = defineEmits<{
    'update:selectedWhenServed': [value: string]
}>()

// Reactive variable for internal state
const internalSelectedWhenServed = ref(props.selectedWhenServed)
const optionsKey = ref(0)

// Component setup for getting when_served values
const componentId = 'meals-when-served'
const system = selectedSystemStore.selectedSystem

const whenServedComponent = computed(() => {
    const component = componentCodeStore.getComponentById(componentId) || componentCodeStore.getDefaultComponent(componentId)
    console.log("WhenServed component:", component)
    console.log("Component SQL:", component?.sql?.['sql'])
    console.log("Table name for meals:", system?.db?.getTableName('meals'))
    return component
})
const correctSqlQuery = computed(() => {
    const sql = whenServedComponent.value?.sql?.['sql']
    if (sql) {
        return sql
    }
    // Fallback SQL if component not found
    console.log("Using fallback SQL")
    return `SELECT DISTINCT when_served FROM ${system?.db?.getTableName('meals')} ORDER BY when_served`
})
const sqlQuery = computed(() => {
    const value = ComponentHandler.getComponentValue(componentId, 'sql', correctSqlQuery.value)
    console.log("ComponentHandler result:", value)
    return value
})

// Get unique when_served values
const whenServedValues = computed(() => {
    const _ = selectedSystemStore.dbNumber;
    console.log("Computing whenServedValues, dbNumber:", _)

    if (!system?.db || typeof system?.db?.query !== "function") {
        console.log("No database available")
        return []
    }

    console.log("SQL Query:", sqlQuery.value)
    const queryResult = system?.db.query(sqlQuery.value)

    console.log("QUERY: ", sqlQuery.value)
    console.log("RESULT: ", queryResult);

    if (queryResult?.success && queryResult.results.length > 0) {
        // Get unique when_served values
        const uniqueValues = [...new Set(queryResult.results.map(row => row.when_served))]
        console.log("Unique values:", uniqueValues)
        return uniqueValues
    }
    console.log("No results or query failed")
    return []
})

// Options for the select menu
const whenServedOptions = computed(() => {
    const options = [{ label: t('all_meals'), value: 'all' }]
    console.log("When served values:", whenServedValues.value)
    whenServedValues.value.forEach(value => {
        if (value && value.trim()) {
            options.push({ label: value, value: value })
        }
    })
    console.log("Final options:", options)
    return options
})

// Watch for options changes to force re-render
watch(whenServedOptions, () => {
    optionsKey.value++
}, { deep: true })

// Watch for prop changes
watch(() => props.selectedWhenServed, (newValue) => {
    internalSelectedWhenServed.value = newValue
})

// Watch for internal changes and emit
watch(internalSelectedWhenServed, (newValue) => {
    emit('update:selectedWhenServed', newValue)
})

// Computed property for v-model
const selectedValue = computed({
    get: () => internalSelectedWhenServed.value,
    set: (value) => {
        internalSelectedWhenServed.value = value
        emit('update:selectedWhenServed', value)
    }
})

useHighlightWatchers(highlightStore.highlightHandler, highlightStore);

</script>

<style scoped>
.when-served-menu {
    display: flex;
    flex-direction: column;
}

select option {
    background-color: gray;
}
</style>