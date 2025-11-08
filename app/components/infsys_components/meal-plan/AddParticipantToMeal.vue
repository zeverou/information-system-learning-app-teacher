<template>
    <div class="add-participant-to-meal-container">
        <USeparator color="primary" class="mb-6" />
        
        <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <UIcon name="i-heroicons-user-plus" class="w-5 h-5 text-sky-600" />
                {{ t('add_participant_to_meal') }}
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <!-- Participant Selection -->
                <div class="highlightable" :id="'add-participant-to-meal-select'">
                    <UFormGroup :label="t('select_participant')">
                        <USelect
                            v-model="selectedParticipant"
                            :items="participantOptions"
                            option-attribute="label"
                            value-attribute="value"
                            :placeholder="t('choose_participant')"
                            size="lg"
                        />
                    </UFormGroup>
                    <div class="absolute top-0 right-0" v-if="highlightStore.isEditModeActive">
                        <EditComponentModalOpenButton
                            component-id="add-participant-to-meal-select"
                        />
                    </div>
                </div>

                <!-- Meal Selection -->
                <div class="highlightable relative" :id="'add-participant-to-meal-meals'">
                    <UFormGroup :label="t('select_meal')">
                        <USelect
                            v-model="selectedMeal"
                            :items="mealOptions"
                            option-attribute="label"
                            value-attribute="value"
                            :placeholder="t('choose_meal')"
                            size="lg"
                        />
                    </UFormGroup>
                    <div class="absolute top-0 right-0" v-if="highlightStore.isEditModeActive">
                        <EditComponentModalOpenButton
                            component-id="add-participant-to-meal-meals"
                        />
                    </div>
                </div>

                <!-- Date Selection -->
                <div class="highlightable relative" :id="'add-participant-to-meal-date'">
                    <UFormGroup :label="t('select_date')">
                        <UInput
                            v-model="selectedDate"
                            type="date"
                            size="lg"
                            :placeholder="t('choose_date')"
                        />
                    </UFormGroup>
                    <div class="absolute top-0 right-0" v-if="highlightStore.isEditModeActive">
                        <EditComponentModalOpenButton
                            component-id="add-participant-to-meal-date"
                        />
                    </div>
                </div>

                <!-- Add Button -->
                <div class="highlightable relative" :id="'add-participant-to-meal-insert'">
                    <UButton
                        @click="highlightStore.isHighlightMode ? highlightStore.highlightHandler.selectElement('add-participant-to-meal-insert', $event) : addParticipantToMeal()"
                        color="primary"
                        size="lg"
                        :loading="isAdding"
                        :disabled="!selectedParticipant || !selectedMeal || !selectedDate"
                        class="w-full"
                    >
                        <UIcon name="i-heroicons-plus" class="w-4 h-4 mr-2" />
                        {{ t('add_to_meal') }}
                    </UButton>
                    <div class="absolute top-0 right-0" v-if="highlightStore.isEditModeActive">
                        <EditComponentModalOpenButton
                            component-id="add-participant-to-meal-insert"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSelectedSystemStore } from '#imports'
import { useHighlightStore } from '~/stores/useHighlightStore'
import { useComponentCodeStore } from '#imports'
import { ComponentHandler } from '~/composables/ComponentHandler'
import { useToast } from '#imports'

const { t } = useI18n()
const selectedSystemStore = useSelectedSystemStore()
const highlightStore = useHighlightStore()
const componentCodeStore = useComponentCodeStore()
const toast = useToast()

const selectedParticipant = ref(undefined)
const selectedMeal = ref(undefined)
const selectedDate = ref('')
const isAdding = ref(false)

// Component definitions
const addParticipantToMealSelectComponent = computed(() => 
    componentCodeStore.getComponentById("add-participant-to-meal-select") || 
    componentCodeStore.getDefaultComponent("add-participant-to-meal-select")
)

const addParticipantToMealMealsComponent = computed(() => 
    componentCodeStore.getComponentById("add-participant-to-meal-meals") || 
    componentCodeStore.getDefaultComponent("add-participant-to-meal-meals")
)

const addParticipantToMealInsertComponent = computed(() => 
    componentCodeStore.getComponentById("add-participant-to-meal-insert") || 
    componentCodeStore.getDefaultComponent("add-participant-to-meal-insert")
)

const addParticipantToMealDateComponent = computed(() => 
    componentCodeStore.getComponentById("add-participant-to-meal-date") || 
    componentCodeStore.getDefaultComponent("add-participant-to-meal-date")
)

// SQL queries
const participantQuery = computed(() => addParticipantToMealSelectComponent.value?.sql?.['sql-1'] || '')
const actualParticipantQuery = computed(() => ComponentHandler.getComponentValue("add-participant-to-meal-select", 'sql-1', participantQuery.value))

const mealQuery = computed(() => addParticipantToMealMealsComponent.value?.sql?.['sql-1'] || '')
const actualMealQuery = computed(() => ComponentHandler.getComponentValue("add-participant-to-meal-meals", 'sql-1', mealQuery.value))

const insertQuery = computed(() => addParticipantToMealInsertComponent.value?.sql?.['sql-1'] || '')
const actualInsertQuery = computed(() => ComponentHandler.getComponentValue("add-participant-to-meal-insert", 'sql-1', insertQuery.value))

// Options for selects
type Option = { label: string; value: any }
const participantOptions = ref<Option[]>([])
const mealOptions = ref<Option[]>([])

const system = selectedSystemStore.selectedSystem

function loadParticipants() {
    if (!system?.db || typeof system?.db?.query !== "function") {
        return
    }

    try {
        const result = system.db.query(actualParticipantQuery.value)
        if (result?.success && result.results) {
            participantOptions.value = result.results.map((participant: any) => ({
                label: participant.name,
                value: participant.id
            }))
        }
    } catch (error) {
        console.warn('Failed to load participants:', error)
    }
}

function loadMeals() {
    if (!system?.db || typeof system?.db?.query !== "function") {
        return
    }

    try {
        const result = system.db.query(actualMealQuery.value)
        if (result?.success && result.results) {
            mealOptions.value = result.results.map((meal: any) => ({
                label: `${meal.name} (${meal.when_served})`,
                value: meal.id
            }))
        }
    } catch (error) {
        console.warn('Failed to load meals:', error)
    }
}

function addParticipantToMeal() {
    if (!selectedParticipant.value || !selectedMeal.value) {
        toast.add({
            title: t('validation_error'),
            description: t('select_participant_and_meal'),
            color: 'red',
            icon: 'i-heroicons-exclamation-triangle'
        })
        return
    }

    if (!system?.db || typeof system?.db?.exec !== "function") {
        toast.add({
            title: t('database_error'),
            description: t('database_not_available'),
            color: 'red',
            icon: 'i-heroicons-exclamation-triangle'
        })
        return
    }

    isAdding.value = true

    try {
        system.db.exec(actualInsertQuery.value, [selectedMeal.value, selectedParticipant.value, selectedDate.value])
        selectedSystemStore.incrementDbNumber()

        toast.add({
            title: t('participant_added_to_meal_success'),
            color: 'primary',
            icon: 'i-heroicons-check'
        })

        // Reset form
        selectedParticipant.value = undefined
        selectedMeal.value = undefined
        selectedDate.value = ''

    } catch (error) {
        console.error('Failed to add participant to meal:', error)
        toast.add({
            title: t('participant_add_to_meal_error'),
            description: error instanceof Error ? error.message : 'Unknown error',
            color: 'red',
            icon: 'i-heroicons-exclamation-triangle'
        })
    } finally {
        isAdding.value = false
    }
}

onMounted(() => {
    if (system?.db) {
        loadParticipants()
        loadMeals()
    }
})
</script>

<style scoped>
.add-participant-to-meal-container {
    margin-top: 2rem;
}
</style>