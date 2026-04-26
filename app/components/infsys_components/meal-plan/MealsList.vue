<template>
    <UButton @click="helperMethod">Helper</UButton>

</template>

<script setup lang="ts">
import { useComponentCodeStore } from '#imports';
import { useSelectedSystemStore } from '#imports';
import { C } from 'vitest/dist/chunks/reporters.d.BFLkQcL6.js';

const props = defineProps<{
    sessionId: number
    date: string
}>()

const selectedSystemStore = useSelectedSystemStore()
const componentCodeStore = useComponentCodeStore()

const componentId: string = 'meal-plan-meal-list';
const system = selectedSystemStore.selectedSystem;


const mealListComponent = computed(() => componentCodeStore.getComponentById(componentId) || componentCodeStore.getDefaultComponent(componentId))

const mealListQuery = computed(() => mealListComponent.value?.sql?.['sql-1'] || '')
const actualMealListQuery = computed(() => ComponentHandler.getComponentValue(componentId, 'sql-1', mealListQuery.value))

function helperMethod() {
    //console.log("Meal List Component:", mealListComponent.value)
    //console.log("Meal List Query:", mealListQuery.value)
    //console.log("Actual Meal List Query:", actualMealListQuery.value)
    //console.log("Session ID Prop:", props.sessionId)
    //console.log("Date Prop:", props.date)
}


</script>