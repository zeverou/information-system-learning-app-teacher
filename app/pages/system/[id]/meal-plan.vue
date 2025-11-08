<template>
    <LocalNavbar>

    </LocalNavbar>


    <div>
        <MealsPlanList></MealsPlanList>
    </div>
        <EditComponentModal v-if="highlightStore.isEditModeActive && highlightStore.selectedComponentId" />

</template>
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSelectedSystemStore, useInformationSystemStore } from '#imports'
import { useHighlightStore } from '~/stores/useHighlightStore'
import { useComponentCodeStore } from '#imports'
import { Component } from '~/model/Component'
import { ComponentHandler } from '~/composables/ComponentHandler'
import { InformationSystem } from '~/model/InformationSystem'
import { ComponentManager } from '#imports'
import MealsPlanList from '~/components/infsys_components/meal-plan/MealsPlanList.vue'


const route = useRoute()
const { t } = useI18n()
const systemStore = useSelectedSystemStore()
const informationSystemStore = useInformationSystemStore()
const highlightStore = useHighlightStore()
const componentCodeStore = useComponentCodeStore()
const selectedSystemStore = useSelectedSystemStore()

// Debug information system store
console.log("Information system store:", informationSystemStore)
console.log("Systems in store:", informationSystemStore.systems)

const componentId = 'meal-plan'


const mealPlanComponent = computed(() => componentCodeStore.getComponentById(componentId) || componentCodeStore.getDefaultComponent(componentId))


// Get system from route and set as selected
const systemId = route.params.id
const systems = informationSystemStore.systems
const system = computed(() => {
    return systems.find((sys: any) => sys.id === parseInt(systemId as string, 10)) || null
})

// Watch for system changes and set selected system
watch(system, (newSystem) => {
    if (newSystem) {
        selectedSystemStore.setSelectedSystem(newSystem as InformationSystem)
    }
}, { immediate: true })

// Watch for database initialization and initialize components when ready
watch(
    () => selectedSystemStore.selectedSystem?.dbInitialized && !ComponentManager.areComponentsInitialized(),
    (shouldInitialize) => {
        if (shouldInitialize && selectedSystemStore.selectedSystem?.db) {
            console.warn("[X] Components not initialized in meal-plan.vue")
            ComponentManager.initializeComponents()
        }
    },
    { immediate: true }
)

// Watch for database availability and trigger data loading
watch(() => selectedSystemStore.selectedSystem?.db, (newDb) => {
    if (newDb) {
        console.log("Database is available for meal plan")
    }
})

// Watch for system changes and ensure data loading
watch(() => selectedSystemStore.selectedSystem, (newSystem) => {
    if (newSystem?.db) {
        console.log("System with database available for meal plan")
    }
})

</script>