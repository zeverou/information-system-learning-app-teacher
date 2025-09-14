<template>
    <LocalNavbar></LocalNavbar>


    <MealsPlanList></MealsPlanList>
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

// Get system from route and set as selected
const systemId = route.params.id
const systems = informationSystemStore.systems
const currentSystem = computed(() => systems.find((sys: any) => sys.id === parseInt(systemId as string, 10)) || null)

const componentId = 'meal-plan'

const system = selectedSystemStore.selectedSystem

const mealPlanComponent = computed(() => componentCodeStore.getComponentById(componentId) || componentCodeStore.getDefaultComponent(componentId))



</script>