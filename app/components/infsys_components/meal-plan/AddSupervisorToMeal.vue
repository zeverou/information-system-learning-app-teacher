<template>
    <div class="add-supervisor-to-meal-container">
        <USeparator color="primary" class="mb-6" />
        
        <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <UIcon name="i-heroicons-user-plus" class="w-5 h-5 text-violet-600" />
                {{ t('add_supervisor_to_meal') }}
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <!-- Supervisor Selection -->
                <div class="highlightable relative" :id="'add-supervisor-to-meal-select'">
                    <UFormGroup :label="t('select_supervisor')">
                        <USelect
                            v-model="selectedSupervisor"
                            :items="supervisorOptions"
                            option-attribute="label"
                            value-attribute="value"
                            :placeholder="t('choose_supervisor')"
                            size="lg"
                        />
                    </UFormGroup>
                    <div class="absolute top-0 right-0" v-if="highlightStore.isEditModeActive">
                        <EditComponentModalOpenButton
                            component-id="add-supervisor-to-meal-select"
                        />
                    </div>
                </div>

                <!-- Meal Selection -->
                <div class="highlightable relative" :id="'add-supervisor-to-meal-meals'">
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
                            component-id="add-supervisor-to-meal-meals"
                            
                        />
                    </div>
                </div>

                <!-- Date Selection -->
                <div class="highlightable relative" :id="'add-supervisor-to-meal-date'">
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
                            component-id="add-supervisor-to-meal-date"

                        />
                    </div>
                </div>

                <!-- Add Button -->
                <div class="highlightable relative" :id="'add-supervisor-to-meal-insert'">
                    <UButton
                        @click="highlightStore.isHighlightMode ? highlightStore.highlightHandler.selectElement('add-supervisor-to-meal-insert', $event) : addSupervisorToMeal()"
                        color="primary"
                        size="lg"
                        :loading="isAdding"
                        :disabled="!selectedSupervisor || !selectedMeal || !selectedDate"
                        class="w-full"
                    >
                        <UIcon name="i-heroicons-plus" class="w-4 h-4 mr-2" />
                        {{ t('add_to_meal') }}
                    </UButton>
                    <div class="absolute top-0 right-0" v-if="highlightStore.isEditModeActive">
                        <EditComponentModalOpenButton
                            component-id="add-supervisor-to-meal-insert"
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

const selectedSupervisor = ref(null)
const selectedMeal = ref(null)
const selectedDate = ref('')
const isAdding = ref(false)

// Component definitions
const addSupervisorToMealSelectComponent = computed(() => 
    componentCodeStore.getComponentById("add-supervisor-to-meal-select") || 
    componentCodeStore.getDefaultComponent("add-supervisor-to-meal-select")
)

const addSupervisorToMealMealsComponent = computed(() => 
    componentCodeStore.getComponentById("add-supervisor-to-meal-meals") || 
    componentCodeStore.getDefaultComponent("add-supervisor-to-meal-meals")
)

const addSupervisorToMealInsertComponent = computed(() => 
    componentCodeStore.getComponentById("add-supervisor-to-meal-insert") || 
    componentCodeStore.getDefaultComponent("add-supervisor-to-meal-insert")
)

const addSupervisorToMealDateComponent = computed(() => 
    componentCodeStore.getComponentById("add-supervisor-to-meal-date") || 
    componentCodeStore.getDefaultComponent("add-supervisor-to-meal-date")
)

// SQL queries
const supervisorQuery = computed(() => addSupervisorToMealSelectComponent.value?.sql?.['sql-1'] || '')
const actualSupervisorQuery = computed(() => ComponentHandler.getComponentValue("add-supervisor-to-meal-select", 'sql-1', supervisorQuery.value))

const mealQuery = computed(() => addSupervisorToMealMealsComponent.value?.sql?.['sql-1'] || '')
const actualMealQuery = computed(() => ComponentHandler.getComponentValue("add-supervisor-to-meal-meals", 'sql-1', mealQuery.value))

const insertQuery = computed(() => addSupervisorToMealInsertComponent.value?.sql?.['sql-1'] || '')
const actualInsertQuery = computed(() => ComponentHandler.getComponentValue("add-supervisor-to-meal-insert", 'sql-1', insertQuery.value))

// Options for selects
const supervisorOptions = ref<{ label: string; value: any }[]>([])
const mealOptions = ref<{ label: string; value: any }[]>([])

const system = selectedSystemStore.selectedSystem

function loadSupervisors() {
    if (!system?.db || typeof system?.db?.query !== "function") {
        return
    }

    try {
        const result = system.db.query(actualSupervisorQuery.value)
        console.log("XX QUERY:", actualSupervisorQuery.value)
        console.log("XX RESULT:", result)
        if (result?.success && result.results) {
            supervisorOptions.value = result.results.map((supervisor: any) => ({
                label: supervisor.name,
                value: supervisor.id
            }))
        }
    } catch (error) {
        console.warn('Failed to load supervisors:', error)
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

function addSupervisorToMeal() {
    if (!selectedSupervisor.value || !selectedMeal.value) {
        toast.add({
            title: t('validation_error'),
            description: t('select_supervisor_and_meal'),
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
        system.db.exec(actualInsertQuery.value, [selectedMeal.value, selectedSupervisor.value, selectedDate.value])
        selectedSystemStore.incrementDbNumber()

        toast.add({
            title: t('supervisor_added_to_meal_success'),
            color: 'primary',
            icon: 'i-heroicons-check'
        })

        // Reset form
        selectedSupervisor.value = null
        selectedMeal.value = null
        selectedDate.value = ''

    } catch (error) {
        console.error('Failed to add supervisor to meal:', error)
        toast.add({
            title: t('supervisor_add_to_meal_error'),
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
        loadSupervisors()
        loadMeals()
    }
})
</script>

<style scoped>
.add-supervisor-to-meal-container {
    margin-top: 2rem;
}
</style>