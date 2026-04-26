<template>
    <!-- Delete meal button -->
    <div class="delete-container">
        <UButton size="md" color="red" variant="soft" @click="deleteMeal">
            {{ t('delete') }}
        </UButton>
        <EditComponentModalOpenButton v-if="highlightStore.isEditModeActive" :componentId="componentId"
            class="edit-button" />
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
const toast = useToast()

const componentId = 'meals-delete'

const system = selectedSystemStore.selectedSystem

const deleteMealButtonComponent = computed(() => componentCodeStore.getComponentById(componentId) || componentCodeStore.getDefaultComponent(componentId))


const correctDeleteMealQuery = computed(() => deleteMealButtonComponent.value?.sql?.['sql-1'] || '')
const correctDeleteAllergensMealsQuery = computed(() => deleteMealButtonComponent.value?.sql?.['sql-2'] || '')
const correctDeleteMealsParticipantsQuery = computed(() => deleteMealButtonComponent.value?.sql?.['sql-3'] || '')
const correctDeleteMealsSupervisorsQuery = computed(() => deleteMealButtonComponent.value?.sql?.['sql-4'] || '')


const actualDeleteMealQuery = computed(() => ComponentHandler.getComponentValue(componentId, 'sql-1', correctDeleteMealQuery.value))
const actualDeleteAllergensMealsQuery = computed(() => ComponentHandler.getComponentValue(componentId, 'sql-2', correctDeleteAllergensMealsQuery.value))
const actualDeleteMealsParticipantsQuery = computed(() => ComponentHandler.getComponentValue(componentId, 'sql-3', correctDeleteMealsParticipantsQuery.value))
const actualDeleteMealsSupervisorsQuery = computed(() => ComponentHandler.getComponentValue(componentId, 'sql-4', correctDeleteMealsSupervisorsQuery.value))

function deleteMeal() {
    if (!system?.db || typeof system?.db?.query !== "function") {
        console.error("Database not available")
        return
    }
    try {
        const result = system?.db.exec(actualDeleteMealQuery.value, [props.mealId])
        const result2 = system?.db.exec(actualDeleteAllergensMealsQuery.value, [props.mealId])
        const result3 = system?.db.exec(actualDeleteMealsParticipantsQuery.value, [props.mealId])
        const result4 = system?.db.exec(actualDeleteMealsSupervisorsQuery.value, [props.mealId])

        selectedSystemStore.incrementDbNumber()
        //console.log("SQL: ", actualDeleteMealQuery, "PARAMS: ", [props.mealId])
        toast.add({
            title: t('delete_meal_success'),
            color: 'primary',
            icon: 'i-heroicons-check'
        })

    } catch (error) {
        console.error("Failed to delete meal", error)
        toast.add({
            title: t('delete_meal_error'),
            color: 'red',
            icon: 'i-heroicons-exclamation-triangle'
        })
    }
}

</script>

<style scoped>
.delete-container {
    position: relative;
    display: inline-block;
}

.edit-button {
    position: absolute;
    top: 0;
    right: 0;
}
</style>