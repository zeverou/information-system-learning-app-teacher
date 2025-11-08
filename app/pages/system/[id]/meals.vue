<template>
    <div>
        <LocalNavbar />

        <div class="container mx-auto px-4 py-8">
                    <h1 class="text-4xl font-bold mb-4">{{ t('meals') }}</h1>

            <!-- Meals Controls -->
            <div class="flex justify-between items-center mb-6">
                <div class="flex items-center gap-4">
                    <WhenServedMenu v-model:selectedWhenServed="selectedWhenServed" />
                    <MealCountBadge :selectedWhenServed="selectedWhenServed" />
                </div>
                <AddMealButton />
            </div>

            <!-- Meals Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="meal in filteredMeals" :key="meal.id" class="meal-card">
                    <div class="highlightable" :id="'meal-card-' + meal.id"
                        @click="highlightStore.isHighlightMode && highlightStore.highlightHandler.selectElement('meal-card-' + meal.id, $event)">
                        <div class="component-wrapper">
                            <!-- Meal Header -->
                            <div class="meal-header">
                                <div class="flex items-center justify-between mb-4">
                                    <h3 class="text-xl font-semibold text-gray-900">
                                        {{ meal.title }}
                                    </h3>
                                    <UBadge size="xl" color="green" variant="soft">
                                        {{ meal.description }}
                                    </UBadge>
                                </div>
                            </div>

                            <!-- Allergens Section -->
                            <div class="allergens-section mb-4">
                                <p class="text-sm font-medium text-gray-700"> {{ t('allergens') }}: </p>
                                <AllergensList :mealId="meal.id" />
                            </div>

                            

                            <!-- Meal Actions -->
                            <div class="meal-actions mt-6 pt-4 border-t border-gray-200">
                                <div class="flex gap-2 justify-end">
                                    <UButton size="md" color="primary" variant="solid" @click="editMeal(meal)">
                                        {{ t('view_details') }}
                                    </UButton>
                                    <DeleteMealButton :mealId="meal.id" />

                                    
                                </div>
                            </div>
                            
                            <EditComponentModalOpenButton v-if="highlightStore.isEditModeActive"
                                :componentId="'meals'" class="edit-button" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="filteredMeals.length === 0" class="empty-state">
                <UIcon name="i-heroicons-cake" class="empty-icon" />
                <h3 class="empty-title">{{ t('no_meals') }}</h3>
                <p class="empty-description">{{ t('no_meals_description') }}</p>
                <UButton size="xl" color="green" class="mt-4" @click="openAddMealModal">
                    {{ t('add_meal') }}
                </UButton>
            </div>
        </div>

        <!-- Edit Meal Modal -->
        <EditMealModal :meal="selectedMealForEdit" v-model:editModalOpen="editModalOpen" />
    </div>
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
import AllergensList from '~/components/infsys_components/meals/AllergensList.vue'
import DeleteMealButton from '~/components/infsys_components/meals/DeleteMealButton.vue'
import WhenServedMenu from '~/components/infsys_components/meals/WhenServedMenu.vue'
import MealCountBadge from '~/components/infsys_components/meals/MealCountBadge.vue'
import AddMealButton from '~/components/infsys_components/meals/AddMealButton.vue'
import EditMealModal from '~/components/infsys_components/meals/EditMealModal.vue'
import { InformationSystem } from '~/model/InformationSystem'
import { ComponentManager } from '#imports'

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

// Watch for system changes and set selected system
watch(currentSystem, (newSystem) => {
    if (newSystem) {
        selectedSystemStore.setSelectedSystem(newSystem as InformationSystem)
    }
}, { immediate: true })

// Watch for database initialization and initialize components when ready
watch(
    () => selectedSystemStore.selectedSystem?.dbInitialized && !ComponentManager.areComponentsInitialized(),
    (shouldInitialize) => {
        if (shouldInitialize && selectedSystemStore.selectedSystem?.db) {
            console.warn("[X] Components not initialized in meals.vue")
            ComponentManager.initializeComponents()
        }
    },
    { immediate: true }
)

const componentId = 'meals'

const system = selectedSystemStore.selectedSystem

// Reactive variables for filtering and modals
const selectedWhenServed = ref('')
const editModalOpen = ref(false)
const selectedMealForEdit = ref(null)

const mealsComponent = computed(() => componentCodeStore.getComponentById(componentId) || componentCodeStore.getDefaultComponent(componentId))


const correctSqlQuery = computed(() => mealsComponent.value?.sql?.['sql'] || '')

const sqlQuery = computed(() => ComponentHandler.getComponentValue(componentId, 'sql', correctSqlQuery.value))

const meals = computed(() => {

    const _ = selectedSystemStore.dbNumber;

    if (!system?.db || !system?.dbInitialized || typeof system?.db?.query !== "function") {
        return []
    }
    const queryResult = system?.db.query(sqlQuery.value)
    if (queryResult?.success && queryResult.results.length > 0) {
        console.log(queryResult.results);
        return queryResult.results.map(row => ({
            id: row.meal_id,
            title: row.name,
            description: row.when_served
        }))
    }
    return []
})

// Filtered meals based on selected when_served
const filteredMeals = computed(() => {
    if (!selectedWhenServed.value || selectedWhenServed.value === 'all') {
        return meals.value
    }
    return meals.value.filter(meal => meal.description === selectedWhenServed.value)
})

// Functions for handling meal operations
const editMeal = (meal: any) => {
    selectedMealForEdit.value = meal
    editModalOpen.value = true
}

const openAddMealModal = () => {
    // This will be handled by the AddMealButton component
}

</script>

<style scoped>
.meal-card {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    border: 4px solid #10b981;
    padding: 1.5rem;
    display: block;
}

.meal-header {
    border-bottom: 1px solid #f3f4f6;
    padding-bottom: 1rem;
    margin-bottom: 1rem;
}

.meal-info {
    margin-bottom: 1.5rem;
}

.meal-actions {
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
}

.empty-state {
    text-align: center;
    padding: 3rem 0;
}

.empty-icon {
    width: 4rem;
    height: 4rem;
    margin: 0 auto 1rem;
    color: #9ca3af;
}

.empty-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.5rem;
}

.empty-description {
    color: #4b5563;
    max-width: 28rem;
    margin: 0 auto;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .meal-card {
        padding: 1rem;
    }
}

.component-wrapper {
    position: relative;
    display: inline-block;
    width: 100%;
}

.edit-button {
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    z-index: 10;
}
</style>