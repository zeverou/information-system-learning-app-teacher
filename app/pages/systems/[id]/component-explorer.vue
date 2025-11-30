<template>
    <LocalNavbar />
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-4xl font-bold mb-6 text-gray-900">Component Explorer</h1>
        
        <div class="flex flex-wrap items-center gap-4 mb-6">
            <UBadge class="total-components-badge px-4 py-2" variant="subtle" size="lg" color="gray">
                Total Components: <span class="font-bold ml-1">{{ componentCodeStore.getActualComponentMap().length }}</span>
            </UBadge>
            <div class="flex gap-2">
                <UButton size="lg" variant="solid" color="white" icon="i-heroicons-clipboard-document-list" @click="logComponents">
                    Log components
                </UButton>
                <UButton class="initialize-components-button" @click="ComponentManager.initializeComponents()" size="lg" variant="solid" color="primary">
                    Initialize Components
                </UButton>
            </div>
        </div>

        <div class="max-h-[800px] overflow-y-auto bg-gray-50 border border-gray-200 p-6 rounded-xl shadow-inner">
            
            <div v-for="component in componentCodeStore.getActualComponentMap()" :key="component.id" 
                 class="bg-white border border-gray-200 rounded-xl mb-6 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                
                <div class="p-6 border-b border-gray-100 bg-white">
                    <div class="flex items-start justify-between gap-4">
                        <div>
                            <div class="flex items-center gap-3 mb-2">
                                <h2 class="text-2xl font-bold text-gray-900">{{ component.name }}</h2>
                                <UBadge color="primary" variant="subtle" size="md">ID: {{ component.id }}</UBadge>
                            </div>
                            <p class="text-gray-600 leading-relaxed">{{ component.description }}</p>
                        </div>
                        <UBadge color="blue" variant="soft" size="md">Component</UBadge>
                    </div>
                </div>

                <div class="p-6 space-y-6 bg-white">
                    
                    <div v-if="Object.keys(component.html).length > 0">
                        <div class="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                            <span class="w-2 h-6 bg-orange-500 rounded-full"></span>
                            <h3 class="text-sm font-bold uppercase tracking-wider text-gray-500">HTML Structure</h3>
                        </div>
                        <div v-for="(value, key) in component.html" :key="key" class="mb-4 last:mb-0">
                            <p class="text-xs font-semibold text-gray-700 mb-1 font-mono">{{ key }}</p>
                            <div class="relative group">
                                <pre class="text-xs font-mono bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto border border-gray-800 shadow-inner leading-relaxed">{{ value }}</pre>
                            </div>
                        </div>
                    </div>

                    <div v-if="Object.keys(component.css).length > 0">
                        <div class="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                            <span class="w-2 h-6 bg-blue-500 rounded-full"></span>
                            <h3 class="text-sm font-bold uppercase tracking-wider text-gray-500">Styles (CSS)</h3>
                        </div>
                        <div v-for="(value, key) in component.css" :key="key" class="mb-4 last:mb-0">
                            <p class="text-xs font-semibold text-gray-700 mb-1 font-mono">{{ key }}</p>
                            <pre class="text-xs font-mono bg-slate-900 text-blue-100 p-4 rounded-lg overflow-x-auto border border-slate-800 shadow-inner leading-relaxed">{{ value }}</pre>
                        </div>
                    </div>

                    <div v-if="Object.keys(component.js).length > 0">
                        <div class="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                            <span class="w-2 h-6 bg-yellow-500 rounded-full"></span>
                            <h3 class="text-sm font-bold uppercase tracking-wider text-gray-500">Logic (JS)</h3>
                        </div>
                        <div v-for="(value, key) in component.js" :key="key" class="mb-4 last:mb-0">
                            <p class="text-xs font-semibold text-gray-700 mb-1 font-mono">{{ key }}</p>
                            <pre class="text-xs font-mono bg-gray-900 text-yellow-50 p-4 rounded-lg overflow-x-auto border border-gray-800 shadow-inner leading-relaxed">{{ value }}</pre>
                        </div>
                    </div>

                    <div v-if="Object.keys(component.sql).length > 0">
                         <div class="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                            <span class="w-2 h-6 bg-purple-500 rounded-full"></span>
                            <h3 class="text-sm font-bold uppercase tracking-wider text-gray-500">Database (SQL)</h3>
                        </div>
                        <div v-for="(value, key) in component.sql" :key="key" class="mb-4 last:mb-0">
                            <p class="text-xs font-semibold text-gray-700 mb-1 font-mono">{{ key }}</p>
                            <pre class="text-xs font-mono bg-gray-900 text-purple-200 p-4 rounded-lg overflow-x-auto border border-gray-800 shadow-inner leading-relaxed">{{ value }}</pre>
                        </div>
                    </div>

                    <div v-if="Object.keys(component.additionals).length > 0">
                        <div class="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                            <span class="w-2 h-6 bg-gray-400 rounded-full"></span>
                            <h3 class="text-sm font-bold uppercase tracking-wider text-gray-500">Additional Config</h3>
                        </div>
                        <div v-for="(value, key) in component.additionals" :key="key" class="mb-4 last:mb-0">
                            <p class="text-xs font-semibold text-gray-700 mb-1 font-mono">{{ key }}</p>
                            <pre class="text-xs font-mono bg-gray-100 text-gray-800 p-4 rounded-lg overflow-x-auto border border-gray-200">{{ value }}</pre>
                        </div>
                    </div>

                </div>
            </div>
            
            <div v-if="componentCodeStore.getActualComponentMap().length === 0" class="flex flex-col items-center justify-center py-20 text-gray-400">
                <div class="text-xl font-medium mb-2">No components loaded</div>
                <p class="text-sm">Click "Initialize Components" to begin.</p>
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