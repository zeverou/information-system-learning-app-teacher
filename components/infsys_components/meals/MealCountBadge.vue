<template>
  <div class="highlightable" id="meals-count-badge"
    @click="highlightStore.isHighlightMode && highlightStore.highlightHandler.selectElement('meals-count-badge', $event)">
    <div class="badge-wrapper">
      <div class="badge-content-wrapper">
        <!-- Rendered HTML -->
        <div v-html="renderedHtml" class="badge-content"></div>

        <!-- Edit button positioned absolutely -->
        <EditComponentModalOpenButton
          v-if="highlightStore.isEditModeActive"
          :componentId="componentId"
          class="edit-button"
        />
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
const correctHtmlTemplate = computed(() => mealsCountBadgeComponent.value?.html?.['html'] || '')
const correctCss = computed(() => mealsCountBadgeComponent.value?.css?.['css'] || '')

const sqlQuery = computed(() => ComponentHandler.getComponentValue(componentId, 'sql', correctSqlQuery.value))
const htmlTemplate = computed(() => ComponentHandler.getComponentValue(componentId, 'html', correctHtmlTemplate.value))
const css = computed(() => ComponentHandler.getComponentValue(componentId, 'css', correctCss.value))

const renderedHtml = computed(() => {
  const html = htmlTemplate.value
    .replace('{{ mealsCount }}', String(mealsCount.value))
    .replace('{{ label }}', getLabel())

  return `<style>${css.value}</style>${html}`;
});

/* 3. Props */

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

const getLabel = () => {
  if (!props.selectedWhenServed || props.selectedWhenServed === 'all') {
    return t('all_meals')
  }
  return `${t('meals')} (${props.selectedWhenServed})`
}

useHighlightWatchers(highlightStore.highlightHandler, highlightStore);

</script>

<style>
.badge-wrapper {
  display: inline-block;
}

.badge-content-wrapper {
  position: relative; /* This will be the reference for the button */
  display: inline-block; /* Shrink to content size */
}

.edit-button {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
}
</style>