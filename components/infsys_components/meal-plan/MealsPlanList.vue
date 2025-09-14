<template>
    <div class="meal-plan-container">
        

        <div class="container mx-auto px-4 py-8">
            <div class="flex items-center justify-between mb-8">
                <h1 class="text-4xl font-bold text-white-950">{{ t('meal_plan') }}</h1>
            </div>

            <!-- Sessions -->
            <div v-for="(dates, sessionId) in dateMap" :key="sessionId" class="session-card mb-8">
                <div class="session-header cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors" @click="expanded[sessionId] = !expanded[sessionId]">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <UIcon name="i-heroicons-calendar-days" class="w-6 h-6 text-sky-600" />
                            <h2 class="text-2xl font-semibold text-gray-900">
                                {{ t('session') }} {{ sessionId }}
                            </h2>
                        </div>
                        <div class="flex items-center gap-3">
                            <UBadge size="xl" color="sky" variant="soft">
                                {{ formatDate(dates[0]) }} - {{ formatDate(dates[dates.length - 1]) }}
                            </UBadge>
                            <UBadge size="xl" color="green" variant="soft">
                                {{ getTotalMealsCount(sessionId) }} {{ t('meals') }}
                            </UBadge>
                            <UIcon
                                :name="expanded[sessionId] ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
                                class="w-5 h-5 text-gray-500 transition-transform hover:text-gray-700" />
                        </div>
                    </div>
                </div>

                <!-- Dates -->
                <div v-if="expanded[sessionId]" class="dates-grid">
                    <div v-for="date in dates" :key="date" class="date-card">
                        <div class="date-header cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors" @click="dateExpanded[date] = !dateExpanded[date]">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <UIcon name="i-heroicons-calendar" class="w-5 h-5 text-sky-600" />
                                    <h3 class="text-xl font-semibold text-gray-900">
                                        {{ formatDate(date) }}
                                    </h3>
                                </div>
                                <div class="flex items-center gap-3">
                                    <UBadge size="xl" color="neutral" variant="soft">
                                        {{ getMealsCount(sessionId, date) }} {{ t('meals') }}
                                    </UBadge>
                                    <UIcon
                                        :name="dateExpanded[date] ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
                                        class="w-5 h-5 text-gray-500 transition-transform hover:text-gray-700" />
                                </div>
                            </div>
                        </div>

                        <!-- Meals -->
                        <div v-if="dateExpanded[date]" class="meals-container">
                            <div v-for="(meals, mealInfo) in getMealsGroupedByType(sessionId, date)"
                                :key="mealInfo" class="meal-item">
                                <div class="meal-header" @click="mealExpanded[mealInfo] = !mealExpanded[mealInfo]">
                                    <div
                                        class="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors">
                                        <div class="flex items-center gap-3">
                                            <UIcon name="i-heroicons-cake" class="w-5 h-5 text-sky-600" />
                                            <div class="flex flex-col gap-2">
                                                <strong class="text-lg text-gray-900">{{ mealInfo }}</strong>
                                                <div v-if="getAllergensForMeal(meals[0]?.mealId || 0).length > 0" class="flex flex-wrap gap-1">
                                                    <UBadge
                                                        v-for="allergen in getAllergensForMeal(meals[0]?.mealId || 0)"
                                                        :key="allergen"
                                                        size="sm"
                                                        color="red"
                                                        variant="soft">
                                                        {{ allergen }}
                                                    </UBadge>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex items-center gap-3">
                                            <UBadge size="xl" color="yellow" variant="solid">
                                                {{ meals[0]?.whenServed }}
                                            </UBadge>
                                            <!--
                                            <UBadge size="xl" color="sky" variant="solid">
                                                {{ meals[0]?.participants?.length || 0 }} {{ t('participants') }}
                                            </UBadge>
                                            <UBadge size="xl" color="violet" variant="solid">
                                                {{ meals[0]?.supervisors?.length || 0 }} {{ t('supervisors') }}
                                            </UBadge>
                                            -->
                                            <UIcon
                                                :name="mealExpanded[mealInfo] ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
                                                class="w-5 h-5 text-gray-500 transition-transform cursor-pointer hover:text-gray-700" />
                                        </div>
                                    </div>
                                </div>

                                <!-- Participants and Supervisors -->
                                <div v-if="mealExpanded[mealInfo]" class="people-grid mt-4">
                                    <!-- Participants Section -->
                                    <div v-if="meals[0]?.participants && meals[0].participants.length > 0" class="mb-4">
                                        <h4 class="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                            <UIcon name="i-heroicons-user-group" class="w-4 h-4 text-sky-600" />
                                            {{ t('participants') }} ({{ meals[0].participants.length }})
                                        </h4>
                                        <div class="participants-grid">
                                            <div v-for="participant in meals[0].participants" :key="participant.participantEmail"
                                                class="participant-card">
                                                <div class="participant-avatar">
                                                    <UIcon name="i-heroicons-user" class="w-8 h-8 text-sky-600" />
                                                </div>
                                                <div class="participant-info">
                                                    <div class="participant-name">{{ participant.participantName }}</div>
                                                </div>
                                                <div class="participant-actions">
                                                    <UButton size="sm" color="red" variant="ghost" @click="removeParticipantFromMeal(participant, mealInfo, sessionId, date)"
                                                        icon="i-heroicons-trash" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Supervisors Section -->
                                    <div v-if="meals[0]?.supervisors && meals[0].supervisors.length > 0">
                                        <h4 class="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                            <UIcon name="i-heroicons-user-group" class="w-4 h-4 text-violet-600" />
                                            {{ t('supervisors') }} ({{ meals[0].supervisors.length }})
                                        </h4>
                                        <div class="supervisors-grid">
                                            <div v-for="supervisor in meals[0].supervisors" :key="supervisor.supervisorEmail"
                                                class="supervisor-card">
                                                <div class="supervisor-avatar">
                                                    <UIcon name="i-heroicons-user" class="w-8 h-8 text-violet-600" />
                                                </div>
                                                <div class="supervisor-info">
                                                    <div class="supervisor-name">{{ supervisor.supervisorName }}</div>
                                                </div>
                                                <UButton 
                                                    @click="removeSupervisorFromMeal(supervisor, meals[0].mealName, sessionId, date)"
                                                    size="xs" 
                                                    color="red" 
                                                    variant="ghost"
                                                    class="delete-supervisor-btn"
                                                >
                                                    <UIcon name="i-heroicons-trash" class="w-4 h-4" />
                                                </UButton>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="Object.keys(dateMap).length === 0" class="empty-state">
                <UIcon name="i-heroicons-calendar-x-mark" class="empty-icon" />
                <h3 class="empty-title">{{ t('no_meal_plan_data') }}</h3>
                <p class="empty-description">{{ t('no_meal_plan_description') }}</p>
            </div>
        </div>
    </div>
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

const mealPlanListQuery = computed(() => mealPlanListComponent.value?.sql?.['sql-2'] || '')
const actualMealPlanListQuery = computed(() => ComponentHandler.getComponentValue(componentId, 'sql-2', mealPlanListQuery.value))

const supervisorQuery = computed(() => mealPlanListComponent.value?.sql?.['sql-3'] || '')
const actualSupervisorQuery = computed(() => ComponentHandler.getComponentValue(componentId, 'sql-3', supervisorQuery.value))

const allergenQuery = computed(() => mealPlanListComponent.value?.sql?.['sql-4'] || `SELECT allergen_id, name FROM \${selectedSystemStore.selectedSystem?.db?.getTableName('allergens_meals')} JOIN \${selectedSystemStore.selectedSystem?.db?.getTableName('meals')} ON \${selectedSystemStore.selectedSystem?.db?.getTableName('allergens_meals')}.meal_id = \${selectedSystemStore.selectedSystem?.db?.getTableName('meals')}.meal_id WHERE \${selectedSystemStore.selectedSystem?.db?.getTableName('allergens_meals')}.meal_id = ?`)
const actualAllergenQuery = computed(() => ComponentHandler.getComponentValue(componentId, 'sql-4', allergenQuery.value))

const system = selectedSystemStore.selectedSystem;

const dateMap = ref<{ [key: number]: string[] }>({}); // Map of session_id to array of dates
const expanded = ref<Record<number, boolean>>({})
const mealsMap = ref<Record<number, Record<string, any[]>>>({}) // sessionId -> date -> meals array
const dateExpanded = ref<Record<string, boolean>>({})
const mealExpanded = ref<Record<string, boolean>>({})

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

function getMealsGroupedByType(sessionId: number, date: string) {
    const meals = mealsMap.value[sessionId]?.[date] || [];
    const grouped: Record<string, any[]> = {};

    for (const meal of meals) {
        const key = `${meal.mealName}`;
        if (!grouped[key]) {
            grouped[key] = [];
        }
        grouped[key].push(meal);
    }

    console.log("GROUPED: ", grouped);
    return grouped;
}

function getMealsCount(sessionId: number, date: string): number {
    const groupedMeals = getMealsGroupedByType(sessionId, date);
    return Object.keys(groupedMeals).length;
}

function getTotalMealsCount(sessionId: number): number {
    const dates = dateMap.value[sessionId] || [];
    let totalMeals = 0;
    for (const date of dates) {
        totalMeals += getMealsCount(sessionId, date);
    }
    return totalMeals;
}

function getMealName(mealInfo: string): string {
    // Extract meal name from "Meal Name (Time)" format
    const match = mealInfo.match(/^(.+)\s*\([^)]+\)$/);
    return match ? match[1].trim() : mealInfo;
}

function deleteParticipant(participant: any) {
    console.log('Deleting participant with ID:', participant.participantId || participant.id || 'No ID found');
}

function removeParticipantFromMeal(participant: any, mealInfo: string, sessionId: number, date: string) {
    console.log('Removing participant from meal:', participant.participantName, 'from', mealInfo);

    // Find the meal in the data structure
    const sessionMeals = mealsMap.value[sessionId];
    const mealsForDate = (sessionMeals && sessionMeals[date]) || [];
    const meal = mealsForDate.find((m: any) => m.mealName === getMealName(mealInfo));

    if (meal) {
        // Remove the participant from the meal's participants array
        const participantIndex = meal.participants.findIndex((p: any) =>
            p.participantEmail === participant.participantEmail &&
            p.participantName === participant.participantName
        );

        if (participantIndex !== -1) {
            meal.participants.splice(participantIndex, 1);
            console.log('Participant removed successfully');

            // Force reactivity update
            mealsMap.value = { ...mealsMap.value };
        } else {
            console.warn('Participant not found in meal');
        }
    } else {
        console.warn('Meal not found for removal');
    }
}

function removeSupervisorFromMeal(supervisor: any, mealInfo: string, sessionId: number, date: string) {
    console.log('Removing supervisor from meal:', supervisor.supervisorName, 'from', mealInfo);

    // Find the meal in the data structure
    const sessionMeals = mealsMap.value[sessionId];
    const mealsForDate = (sessionMeals && sessionMeals[date]) || [];
    const meal = mealsForDate.find((m: any) => m.mealName === getMealName(mealInfo));

    if (meal) {
        // Remove the supervisor from the meal's supervisors array
        const supervisorIndex = meal.supervisors.findIndex((s: any) =>
            s.supervisorEmail === supervisor.supervisorEmail &&
            s.supervisorName === supervisor.supervisorName
        );

        if (supervisorIndex !== -1) {
            meal.supervisors.splice(supervisorIndex, 1);
            console.log('Supervisor removed successfully');

            // Force reactivity update
            mealsMap.value = { ...mealsMap.value };
        } else {
            console.warn('Supervisor not found in meal');
        }
    } else {
        console.warn('Meal not found for supervisor removal');
    }
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

    // Query for sessions
    const sessionQuery = ComponentHandler.getComponentValue(componentId, 'sql-1', mealPlanListComponent.value?.sql?.['sql-1'] || '');
    const sessionResult = currentSystem.db.query(sessionQuery);
    console.log("Session Query Result:", sessionResult);
    if (sessionResult.success && sessionResult.results) {
        for (const row of sessionResult.results) {
            const dates = getDateArray(row.from_date, row.to_date);
            dateMap.value[row.session_id] = dates;
        }
        console.log("Date Map:", dateMap.value);
    }

    // Query for meals with participants
    const participantResult = currentSystem.db.query(actualMealPlanListQuery.value);
    console.log("Participant Meal Query Result:", participantResult);

    // Query for meals with supervisors
    const supervisorResult = currentSystem.db.query(actualSupervisorQuery.value);
    console.log("Supervisor Meal Query Result:", supervisorResult);

    if ((participantResult.success && participantResult.results) || (supervisorResult.success && supervisorResult.results)) {
        // Reset meals map
        mealsMap.value = {};

        // Process participant data
        if (participantResult.success && participantResult.results) {
            for (const row of participantResult.results) {
                const sessionId = row.session_id;
                const date = row.date_served;
                const mealId = row.meal_id;

                if (!mealsMap.value[sessionId]) {
                    mealsMap.value[sessionId] = {};
                }
                if (!mealsMap.value[sessionId][date]) {
                    mealsMap.value[sessionId][date] = [];
                }

                // Find existing meal or create new one
                let meal = mealsMap.value[sessionId][date].find(m => m.mealId === mealId && m.mealName === row.meal_name);
                if (!meal) {
                    meal = {
                        mealId: mealId,
                        mealName: row.meal_name,
                        whenServed: row.when_served,
                        participants: [],
                        supervisors: [],
                        allergens: []
                    };
                    mealsMap.value[sessionId][date].push(meal);
                }

                // Add participant
                if (row.participant_name && row.participant_email) {
                    meal.participants.push({
                        participantName: row.participant_name,
                        participantEmail: row.participant_email
                    });
                }
            }
        }

        // Process supervisor data
        if (supervisorResult.success && supervisorResult.results) {
            for (const row of supervisorResult.results) {
                const sessionId = row.session_id;
                const date = row.date_served;
                const mealId = row.meal_id;

                if (!mealsMap.value[sessionId]) {
                    mealsMap.value[sessionId] = {};
                }
                if (!mealsMap.value[sessionId][date]) {
                    mealsMap.value[sessionId][date] = [];
                }

                // Find existing meal or create new one
                let meal = mealsMap.value[sessionId][date].find(m => m.mealId === mealId && m.mealName === row.meal_name);
                if (!meal) {
                    meal = {
                        mealId: mealId,
                        mealName: row.meal_name,
                        whenServed: row.when_served,
                        participants: [],
                        supervisors: [],
                        allergens: []
                    };
                    mealsMap.value[sessionId][date].push(meal);
                }

                // Add supervisor
                if (row.supervisor_name && row.supervisor_email) {
                    meal.supervisors.push({
                        supervisorName: row.supervisor_name,
                        supervisorEmail: row.supervisor_email
                    });
                }
            }
        }

        console.log("Meals Map:", mealsMap.value);
    }
}

// Function to get allergens for a specific meal
function getAllergensForMeal(mealId: number) {
    if (!system?.db || typeof system?.db?.query !== "function") {
        return []
    }

    try {
        const queryResult = system.db.query(actualAllergenQuery.value, [mealId])
        console.log("Allergen QUERY:", actualAllergenQuery.value, mealId)
        console.log("Allergen RESULT:", queryResult)

        if (queryResult?.success && queryResult.results.length > 0) {
            console.log("Allergen results:", queryResult.results);
            return queryResult.results.map((row: any) => row.name)
        }
    } catch (error) {
        console.warn(`Failed to fetch allergens for meal ${mealId}:`, error);
    }

    return []
}

const allergens = computed(() => {
    // This computed property follows the user's pattern but returns allergen names instead of objects
    // For now, return empty array as we handle allergens per meal
    return []
})

</script>

<style scoped>
.meal-plan-container {
    min-height: 100vh;
}

/* Session Cards */
.session-card {
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    border: 1px solid #e5e7eb;
    padding: 2rem;
}

.session-header {
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 1.5rem;
    margin-bottom: 1.5rem;
}

/* Date Cards */
.dates-grid {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.date-card {
    background: #f8fafc;
    border-radius: 0.5rem;
    border: 1px solid #e2e8f0;
    padding: 1.5rem;
}

.date-header {
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 1rem;
    margin-bottom: 1rem;
}

/* Meals Container */
.meals-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.meal-item {
    background: white;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
    overflow: hidden;
}

.meal-header {
    border-bottom: 1px solid #f1f5f9;
}

/* People Grid */
.people-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

/* Supervisors Grid */
.supervisors-grid {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem;
}

.supervisor-card {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: #faf5ff;
    border-radius: 0.5rem;
    border: 1px solid #e9d5ff;
    padding: 1rem;
    transition: all 0.2s ease;
}

.supervisor-card:hover {
    background: #f3e8ff;
    border-color: #d8b4fe;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.supervisor-avatar {
    flex-shrink: 0;
    width: 2.5rem;
    height: 2.5rem;
    background: #ede9fe;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.supervisor-info {
    flex: 1;
    min-width: 0;
}

.supervisor-name {
    font-weight: 600;
    font-size: 0.875rem;
    color: #7c3aed;
    margin-bottom: 0.25rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
}

/* Participants Grid */
.participants-grid {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem;
}

.participant-card {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: #f0f9ff;
    border-radius: 0.5rem;
    border: 1px solid #e0f2fe;
    padding: 1rem;
    transition: all 0.2s ease;
}

.participant-card:hover {
    background: #e0f2fe;
    border-color: #bae6fd;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.participant-avatar {
    flex-shrink: 0;
    width: 2.5rem;
    height: 2.5rem;
    background: #e0f2fe;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.participant-info {
    flex: 1;
    min-width: 0;
    margin-right: 1rem;
}

.participant-name {
    font-weight: 600;
    font-size: 0.875rem;
    color: #0ea5e9;
    margin-bottom: 0.25rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
}

.participant-email {
    font-size: 0.75rem;
    color: #64748b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.participant-actions {
    flex-shrink: 0;
    margin-left: auto;
    width: 2rem;
}

/* Empty State */
.empty-state {
    text-align: center;
    padding: 4rem 2rem;
    background: white;
    border-radius: 0.75rem;
    border: 1px solid #e5e7eb;
}

.empty-icon {
    width: 4rem;
    height: 4rem;
    margin: 0 auto 1.5rem;
    color: #cbd5e1;
}

.empty-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
}

.empty-description {
    color: #6b7280;
    max-width: 28rem;
    margin: 0 auto;
}

/* Responsive Design */
@media (max-width: 768px) {
    .meal-plan-container .container {
        padding-left: 1rem;
        padding-right: 1rem;
    }

    .session-card {
        padding: 1.5rem;
    }

    .dates-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .participants-grid {
        gap: 0.75rem;
    }

    .participant-card {
        padding: 0.75rem;
    }
}

@media (max-width: 640px) {
    .meal-plan-container .container {
        padding-left: 0.75rem;
        padding-right: 0.75rem;
    }

    .session-card {
        padding: 1rem;
    }
}

/* Navbar positioning */
.navbar-area {
    z-index: 20 !important;
    position: relative !important;
}
</style>
