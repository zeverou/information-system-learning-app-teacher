<template>
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-4xl font-bold mb-4">Component Explorer</h1>
        <div style="display: flex; gap: 1rem;" class="mb-4">
            <UBadge class="total-components-badge" variant="soft" size="xl">Total Components: {{ componentCodeStore.getActualComponentMap().length }}</UBadge>
            <UButton  size="xl" variant="soft"  color="primary" @click="logComponents">
                Log components
            </UButton>
            <UButton class="initialize-components-button" @click="ComponentManager.initializeComponents()" size="xl" variant="soft" color="primary">Initialize Components</UButton>
        </div>
        <div class="max-h-96 overflow-y-auto bg-white p-4 rounded-lg shadow-inner">
            <div v-for="component in componentCodeStore.getActualComponentMap()" :key="component.id" class="bg-white shadow-md rounded-lg p-6 mb-4 hover:shadow-lg transition-shadow duration-200">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <h2 class="text-xl font-semibold text-gray-800 mb-2">{{ component.name }}</h2>
                        <p class="text-gray-600 mb-2">{{ component.description }}</p>
                        <p class="text-sm text-gray-500">ID: <span class="font-mono bg-gray-100 px-2 py-1 rounded">{{ component.id }}</span></p>
                    </div>
                    <div class="ml-4">
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            Component
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useSelectedSystemStore } from '#imports';
import { useComponentCodeStore } from '#imports';
import { ComponentManager } from '#imports';

const selectedSystemStore = useSelectedSystemStore();
const componentCodeStore = useComponentCodeStore();

function logComponents() {
    console.log("Actual:" , componentCodeStore.getActualComponentMap());
    console.log("Default:" , componentCodeStore.getDefaultComponentMap());
}

onMounted(() => {
    // if (!ComponentManager.areComponentsInitialized()) {
    //     ComponentManager.initializeComponents();
    // }
    // componentCodeStore.resetAllComponents();
});
</script>