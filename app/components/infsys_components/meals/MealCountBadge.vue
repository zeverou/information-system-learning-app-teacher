<template>
  <div v-if="system" class="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg whitespace-nowrap">
    <UIcon name="i-lucide-utensils" class="w-4 h-4 text-gray-600" />
    <!-- Meal Count -->
    <div class="highlightable inline-flex items-center" :id="'meals-count-badge'"
      @click="highlightStore.isHighlightMode && highlightStore.highlightHandler.selectElement('meals-count-badge', $event)">
      <div class="component-wrapper inline-flex items-center">
        <span class="text-sm font-medium text-gray-700">
          {{ t('meal_count') }}: {{ mealsCount }}
        </span>
        <EditComponentModalOpenButton v-if="highlightStore.isEditModeActive"
          :componentId="'meals-count-badge'" class="edit-button" />
      </div>
    </div>
  </div>
  <EditComponentModal v-if="highlightStore.isEditModeActive && highlightStore.selectedComponentId" />
</template>

<script setup lang="ts">
/* 1. Imports */
import { computed } from 'vue'
import { InformationSystem } from '~/model/InformationSystem'
import { useHighlightStore } from '#imports';
import { useSelectedSystemStore } from '#imports';
import { useComponentCodeStore } from '#imports';

/* 2. Context hooks */
const { t } = useI18n()
const highlightStore = useHighlightStore();
const selectedSystemStore = useSelectedSystemStore();
const componentCodeStore = useComponentCodeStore();

const componentId = 'meals-count-badge';
const system = selectedSystemStore.selectedSystem;

// Props
const props = defineProps<{
  selectedWhenServed?: string
}>()

const mealsCountBadgeComponent = computed(() => componentCodeStore.getComponentById(componentId) || componentCodeStore.getDefaultComponent(componentId))

const correctSqlQuery = computed(() => {
  if (props.selectedWhenServed && props.selectedWhenServed !== 'all') {
    return mealsCountBadgeComponent.value?.sql?.['sql-2'] || ''
  }
  return mealsCountBadgeComponent.value?.sql?.['sql-1'] || ''
})

const sqlQuery = computed(() => ComponentHandler.getComponentValue(componentId, 'sql', correctSqlQuery.value))

/* 4. Emits */
// none

/* 5. Computed */
const mealsCount = computed(() => {
  if (!system?.db || typeof system?.db?.query !== "function") {
    return 0
  }

  // Use sql-2 with parameter when a specific when_served is selected
  if (props.selectedWhenServed && props.selectedWhenServed !== 'all') {
    const result = system?.db.query(sqlQuery.value, [props.selectedWhenServed]).results?.[0]?.count
    return result || 0
  }

  // Use sql-1 for all meals
  const result = system?.db.query(sqlQuery.value).results?.[0]?.count
  return result || 0
})

useHighlightWatchers(highlightStore.highlightHandler, highlightStore);

</script>

<style>
.component-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.edit-button {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
}
</style>