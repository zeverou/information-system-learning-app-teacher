<template>
    <!-- Custom Drawer Implementation -->
    <div v-if="modalOpen" class="custom-drawer-overlay" @click="resetForm" style="z-index: 5000;">
        <div class="custom-drawer" :class="{ 'open': modalOpen }" @click.stop>
            <div class="drawer-content">
                <UCard class="p-4 min-w-96">
                    <template #header>
                        <h3 class="text-lg font-semibold">{{ t('add_meal') }}</h3>
                    </template>
                    <!-- TODO: Create working edit component modals for the form fields -->
                    <UForm :state="newMeal" @submit="handleAddMeal(newMeal)" class="flex flex-col space-y-4">
                        <div class="highlightable" id="meals-add-name"
                            @click="highlightStore.isHighlightMode && highlightStore.highlightHandler.selectElement('meals-add-name', $event)">
                            <div class="component-wrapper">
                                <label for="name" class="block text-sm font-medium text-white mb-1">{{ t('meal_name')
                                }}</label>
                                <input
                                    :class="['form-input', { 'border-red-500': !newMealNameComputed, 'border-sky-500': newMealNameComputed }]"
                                    id="name" v-model="newMeal.name" type="text"
                                    :disabled="highlightStore.isHighlightMode" :placeholder="t('enter_meal_name')" />
                                <div v-if="newMealNameError" class="text-red-500 text-sm mt-1 font-bold">
                                    {{ newMealNameError }}
                                </div>
                                <!-- <EditComponentModalOpenButton v-if="highlightStore.isEditModeActive"
                                    :componentId="'validation-name'" class="edit-button" /> -->
                            </div>
                        </div>

                        <div class="highlightable" id="meals-add-when_served"
                            @click="highlightStore.isHighlightMode && highlightStore.highlightHandler.selectElement('meals-add-when_served', $event)">
                            <div class="component-wrapper">
                                <label for="when_served" class="block text-sm font-medium text-white mb-1">{{
                                    t('when_served') }}</label>
                                <USelect :color="newMealWhenServedComputed ? 'primary' : 'red'" id="when_served"
                                    v-model="newMeal.when_served" :items="whenServedOptions"
                                    :disabled="highlightStore.isHighlightMode" :placeholder="t('select_when_served')" />
                                <div v-if="newMealWhenServedError" class="text-red-500 text-sm mt-1 font-bold">
                                    {{ newMealWhenServedError }}
                                </div>
                                <!-- <EditComponentModalOpenButton v-if="highlightStore.isEditModeActive"
                                    :componentId="'meals-add'" class="edit-button" /> -->
                            </div>
                        </div>

                        <div class="highlightable" id="meals-add-allergens"
                            @click="highlightStore.isHighlightMode && highlightStore.highlightHandler.selectElement('meals-add-allergens', $event)">
                            <div class="component-wrapper">
                                <label for="allergens"
                                    class="block text-sm font-medium text-white mb-1">Alergeny</label>
                                <USelect :color="newMealAllergensComputed ? 'primary' : 'red'" id="allergens"
                                    v-model="newMeal.allergens" :items="allergenOptions" multiple
                                    placeholder="Vyberte alergeny" :disabled="highlightStore.isHighlightMode" />
                                <div v-if="newMealAllergensError" class="text-red-500 text-sm mt-1 font-bold">
                                    {{ newMealAllergensError }}
                                </div>
                                <!-- <EditComponentModalOpenButton v-if="highlightStore.isEditModeActive"
                                    :componentId="'validation-allergens'" class="edit-button" /> -->
                            </div>
                        </div>

                        <div class="flex flex-col gap-3 pt-4">
                            <UButton type="submit" color="green" :loading="isSubmitting"
                                :disabled="hasValidationErrors">
                                {{ t('add') }}
                            </UButton>
                            <UButton variant="outline" color="green" @click="resetForm">
                                {{ t('cancel') }}
                            </UButton>
                        </div>
                    </UForm>
                </UCard>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSelectedSystemStore, useToast } from '#imports'
import { useHighlightStore } from '#imports'
import { useComponentCodeStore } from '~/stores/useComponentCodeStore'
import EditComponentModalOpenButton from '~/components/EditComponentModalOpenButton.vue'

const { t } = useI18n()
const selectedSystemStore = useSelectedSystemStore()
const toast = useToast()
const highlightStore = useHighlightStore()
const componentCodeStore = useComponentCodeStore()

const system = selectedSystemStore.selectedSystem
if (!system?.db) {
    throw new Error('Database not available')
}

// Get the add meal component
const componentId = 'meals-add'
const addMealComponent = componentCodeStore.getComponentById(componentId) || componentCodeStore.getDefaultComponent(componentId)
const sqlQuery = addMealComponent?.sql?.['sql-1'] || ''


// Props
const props = defineProps<{
    addModalOpen: boolean
}>()

// Emits
const emit = defineEmits<{
    'update:addModalOpen': [value: boolean]
}>()

// Modal state
const modalOpen = computed({
    get: () => props.addModalOpen,
    set: (value) => emit('update:addModalOpen', value)
})

// Form state
const newMeal = ref({
    name: '',
    when_served: '',
    allergens: [] as number[]
})

const isSubmitting = ref(false)

// Validation
const newMealNameComputed = computed(() => newMeal.value.name.trim().length > 0)
const newMealWhenServedComputed = computed(() => newMeal.value.when_served.trim().length > 0)
const newMealAllergensComputed = computed(() => {
    // Allergens are optional - always return true
    return true
})

const newMealNameError = computed(() => {
    if (!newMealNameComputed.value) {
        return t('meal_name_required')
    }
    return ''
})

const newMealWhenServedError = computed(() => {
    if (!newMealWhenServedComputed.value) {
        return t('when_served_required')
    }
    return ''
})

const newMealAllergensError = computed(() => {
    // Allergens are optional - no error
    return ''
})

const hasValidationErrors = computed(() => {
    return !newMealNameComputed.value || !newMealWhenServedComputed.value
})

// When served options
/* TODO: hardcoded options only for czech lang */
const whenServedOptions = [
    { label: t('breakfast'), value: 'snídaně' },
    { label: t('lunch'), value: 'oběd' },
    { label: t('dinner'), value: 'večeře' },
]


// Allergen options
const allergenOptions = computed(() => {
    const _ = selectedSystemStore.dbNumber
    const query: string = componentCodeStore.getComponentCodeByType('participants-allergen-options', 'sql', 'sql') || ``;
    const result = selectedSystemStore.selectedSystem?.db?.query(query)?.results || [];
    return result.map(allergen => ({
        label: allergen.name,
        value: allergen.allergen_id
    }))
})

// Handle form submission
const handleAddMeal = async (mealData: any) => {
    if (hasValidationErrors.value) {
        return
    }

    isSubmitting.value = true

    try {


        // Execute the insert query
        system.db.exec(sqlQuery, [mealData.name, mealData.when_served])

        // If we reach here without error, the meal was added successfully
        selectedSystemStore.incrementDbNumber()
        toast.add({
            title: t('meal_added_successfully'),
            color: 'green'
        })

        console.log("Meal allergens:", mealData.allergens)

        // Get the last inserted row id
        const result = system.db.query("SELECT last_insert_rowid() as id");

        
        const lastId = result.results[0].id
        console.log("Last inserted meal ID:", lastId)


        // Inserting allergens
        for (const allergenId of mealData.allergens) {
            const insertAllergenSql = componentCodeStore.getComponentCodeByType('meals-add', 'sql', 'sql-2') || ''
            system.db.exec(insertAllergenSql, [lastId, allergenId])
        }

        resetForm()
    } catch (error) {
        console.error('Failed to add meal:', error)
        toast.add({
            title: t('meal_add_error'),
            color: 'red'
        })
    } finally {
        isSubmitting.value = false
    }
}

// Reset form
const resetForm = () => {
    newMeal.value = {
        name: '',
        when_served: '',
        allergens: []
    }
    modalOpen.value = false
}

// Watch for modal open to reset form
watch(() => modalOpen.value, (isOpen) => {
    if (isOpen) {
        resetForm()
        modalOpen.value = true // Keep modal open after reset
    }
})
</script>

<style scoped>
.custom-drawer-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 5000;
    display: flex;
    align-items: stretch;
    justify-content: flex-end;
    transition: opacity 0.3s ease;
}

.custom-drawer {
    width: 400px;
    max-width: 90vw;
    background: #1e293b;
    box-shadow: -4px 0 20px rgba(0, 0, 0, 0.3);
    transform: translateX(100%);
    transition: transform 0.3s ease;
    overflow-y: auto;
    border-left: 1px solid #334155;
    z-index: 5001;
}

.custom-drawer.open {
    transform: translateX(0);
}

.drawer-content {
    padding: 1rem;
    height: 100%;
}

.form-input {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    background-color: #ffffff;
    color: #111827;
    font-size: 0.875rem;
    line-height: 1.25rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input:disabled {
    background-color: #f9fafb;
    color: #6b7280;
    cursor: not-allowed;
}

/* Validation colors */
.border-red-500 {
    border-color: #ef4444 !important;
    border-width: 3px !important;
}

.border-sky-500 {
    border-color: #05df72 !important;
    border-width: 3px !important;
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
