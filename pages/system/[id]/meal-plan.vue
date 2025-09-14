<template>
    <LocalNavbar></LocalNavbar>


    <!-- TODO: GROUP BY SESSIONS -->
    <div>
                <h1 class="text-4xl font-bold mb-4">{{ t('meal_plan') }}</h1>

        <UCard v-for="meal in meals" :key="meal.description" class="mb-4" style="margin: 10px;">
            <UCardHeader>
                <h3 class="text-lg font-semibold">{{ reformatDate(meal.description) }}</h3>
            </UCardHeader>
            <!--
            <UCardBody>
                <p>{{ t('meal_id') }}: {{ meal.id }}</p>
            </UCardBody>
-->
        </UCard>
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


const route = useRoute()
const { t } = useI18n()
const systemStore = useSelectedSystemStore()
const highlightStore = useHighlightStore()
const componentCodeStore = useComponentCodeStore()
const selectedSystemStore = useSelectedSystemStore()

const componentId = 'meal-plan'

const system = selectedSystemStore.selectedSystem

const mealPlanComponent = computed(() => componentCodeStore.getComponentById(componentId) || componentCodeStore.getDefaultComponent(componentId))

const correctParticipantMealsQuery = computed(() => mealPlanComponent.value?.sql?.['sql-1'] || '')
const actualParticipantMealsQuery = computed(() => ComponentHandler.getComponentValue(componentId, 'sql-1', correctParticipantMealsQuery.value))

const meals = computed(() => {

    const _ = selectedSystemStore.dbNumber;

    if (!system?.db || typeof system?.db?.query !== "function") {
        return []
    }
    const queryResult = system?.db.query(actualParticipantMealsQuery.value)
    if (queryResult?.success && queryResult.results.length > 0) {
        console.log(queryResult.results);
        return queryResult.results.map(row => ({
            description: row.date_served
        }))
    }
    return []
})

function reformatDate(dateString: string) {
    // Split the date string by '-'
    const parts = dateString.split('-');
    // Rearrange to DD. MM. YYYY
    return `${parseInt(parts[2])}. ${parseInt(parts[1])}. ${parts[0]}`;
}


</script>