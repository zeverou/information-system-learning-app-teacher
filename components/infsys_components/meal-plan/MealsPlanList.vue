<template>
    <div>
        <UCard v-for="(dates, sessionId) in dateMap" :key="sessionId" class="mb-4">
            <div class="font-semibold">{{ t('session') }} {{ sessionId }}: {{ formatDate(dates[0]) }} to {{ formatDate(dates[dates.length - 1]) }}</div>
            <UButton @click="expanded[sessionId] = !expanded[sessionId]" class="mt-2">
                {{ expanded[sessionId] ? 'Hide Dates' : 'Show Dates' }}
            </UButton>
            <div v-if="expanded[sessionId]" class="mt-2">
                <UCard v-for="date in dates" :key="date" class="mb-2 p-2">
                    {{ formatDate(date) }}
                </UCard>
            </div>
        </UCard>
    </div>
    <UButton @click="helperMethod">Helper</UButton>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSelectedSystemStore, useInformationSystemStore } from '#imports'
import { useHighlightStore } from '~/stores/useHighlightStore'
import { useComponentCodeStore } from '#imports'
import { ComponentHandler } from '~/composables/ComponentHandler'


const { t } = useI18n()
const componentCodeStore = useComponentCodeStore()
const selectedSystemStore = useSelectedSystemStore()

const componentId = 'meal-plan-list'

const mealPlanListComponent = computed(() => componentCodeStore.getComponentById(componentId) || componentCodeStore.getDefaultComponent(componentId))
console.log("Meal Plan List Component:", mealPlanListComponent.value)

const mealPlanListQuery = computed(() => mealPlanListComponent.value?.sql?.['sql-1'] || '')
const actualMealPlanListQuery = computed(() => ComponentHandler.getComponentValue(componentId, 'sql-1', mealPlanListQuery.value))

const system = selectedSystemStore.selectedSystem;

const dateMap = ref<{ [key: number]: string[] }>({}); // Map of session_id to array of dates
const expanded = ref<Record<number, boolean>>({})

function helperMethod() {
    loadData();
}

function getDateArray(startDate: string, endDate: string): string[] {
    const dates = [];
    let currentDate = new Date(startDate);
    const lastDate = new Date(endDate);

    while (currentDate <= lastDate) {
        dates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(1, '0');
    const month = String(date.getMonth() + 1).padStart(1, '0');
    const year = date.getFullYear();
    return `${day}. ${month}. ${year}`;
}

onMounted(() => {
    console.log("onMounted: System:", selectedSystemStore.selectedSystem);
    if (selectedSystemStore.selectedSystem) {
        loadData();
    }
})

watch(() => selectedSystemStore.selectedSystem, (newSystem) => {
    console.log("System changed:", newSystem);
    if (newSystem) {
        loadData();
    }
})

function loadData() {
    const currentSystem = selectedSystemStore.selectedSystem;
    console.log("Loading data");
    console.log("Meal Plan List Component:", mealPlanListComponent.value);
    console.log("Actual Query:", actualMealPlanListQuery.value);

    if (!currentSystem?.db || typeof currentSystem?.db?.query !== "function") {
        console.warn("Database not available or query method missing.");
        return;
    }
    const result = currentSystem.db.query(actualMealPlanListQuery.value);
    console.log("Query Result:", result);
    if (result.success && result.results) {
        for (const row of result.results) {
            const dates = getDateArray(row.from_date, row.to_date);
            dateMap.value[row.session_id] = dates;
        }
        console.log("Date Map:", dateMap.value);
    } else {
        console.warn("Query failed or no results");
    }
}



</script>
