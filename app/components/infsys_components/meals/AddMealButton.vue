<template>
    <div>
        <UButton size="xl" color="green" variant="outline" @click="handleButtonClick($event)" icon="i-heroicons-plus">
            {{ t('add_meal') }}
        </UButton>
    </div>

    <AddMealModal v-model:addModalOpen="addModalOpen" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHighlightStore } from '#imports'
import AddMealModal from './AddMealModal.vue'

const { t } = useI18n()
const highlightStore = useHighlightStore()
const addModalOpen = ref(false)

const createNewMeal = () => {
    if (!highlightStore.isHighlightMode) {
        addModalOpen.value = true
    }
}

const handleButtonClick = (event: Event) => {
    event.stopPropagation()
    if (highlightStore.isHighlightMode) {
        highlightStore.highlightHandler.selectElement('meals-add-button', event)
    } else {
        createNewMeal()
    }
}

// Expose modal state for parent component
defineExpose({
    addModalOpen
})
</script>
