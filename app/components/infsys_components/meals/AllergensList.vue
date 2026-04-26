<template>
    <div>
        <div v-for="allergen in allergens" :key="allergen.id"
            style="display: inline-flex; align-items: center; padding: 0.125rem 0.625rem; font-size: 0.75rem; font-weight: 500; border-radius: 9px; background-color: #fef2f2; color: #dc2626; border: 1px solid rgba(220, 38, 38, 0.1); white-space: nowrap; margin-right: 0.25rem; margin-bottom: 0.25rem;">
            {{ getAllergenName(allergen.id) }}
        </div>
        <span v-if="allergens.length === 0" class="text-sm text-green-600">
            <UIcon name="i-heroicons-check-circle" class="w-4 h-4 inline mr-1" />
            {{ t('no_allergens') }}
        </span>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSelectedSystemStore } from '~/stores/useSelectedSystemStore'
import { useHighlightStore } from '~/stores/useHighlightStore'
import { useComponentCodeStore } from '#imports'
import { Component } from '~/model/Component'
import { ComponentHandler } from '~/composables/ComponentHandler'

// Props
const props = defineProps<{
    mealId: number
}>()

const route = useRoute()
const { t } = useI18n()
const systemStore = useSelectedSystemStore()
const highlightStore = useHighlightStore()
const componentCodeStore = useComponentCodeStore()
const selectedSystemStore = useSelectedSystemStore()

const componentId = 'meals-allergens'

const system = selectedSystemStore.selectedSystem

const mealsAllergensComponent = computed(() => componentCodeStore.getComponentById(componentId) || componentCodeStore.getDefaultComponent(componentId))


const correctSqlQuery = computed(() => mealsAllergensComponent.value?.sql?.['sql-1'] || '')
const sqlQuery = computed(() => ComponentHandler.getComponentValue(componentId, 'sql-1', correctSqlQuery.value))

const correctAllergensQuery = computed(() => mealsAllergensComponent.value?.sql?.['sql-2'] || '')
const allergensQuery = computed(() => ComponentHandler.getComponentValue(componentId, 'sql-2', correctAllergensQuery.value))


// Computed property to get allergen IDs for the specific meal
const allergens = computed(() => {

    const _ = selectedSystemStore.dbNumber


    if (!system?.db || typeof system?.db?.query !== "function") {
        return []
    }
    const queryResult = system?.db.query(sqlQuery.value, [props.mealId])
    //console.log("QUERY:", sqlQuery.value, props.mealId)
    //console.log("RESULT:", queryResult)
    if (queryResult?.success && queryResult.results.length > 0) {
        //console.log(queryResult.results);
        return queryResult.results.map(row => ({
            id: row.allergen_id
        }))
    }
    return []
})

function getAllergenName(allergenId: number): string {
    if (!system?.db || typeof system?.db?.query !== "function") {
        return 'Unknown'
    }

    const queryResult = system?.db.query(allergensQuery.value, [allergenId])
    //console.log("ALLERGEN QUERY:", allergensQuery.value, allergenId)
    //console.log("ALLERGEN RESULT:", queryResult)
    if (queryResult?.success && queryResult.results.length > 0) {
        const allergen = queryResult.results[0]
        return allergen.name
    }
    return 'Unknown'
}


</script>