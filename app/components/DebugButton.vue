<template>
    <UModal title="Debug Systems" :ui="{ content: 'w-[80vw] max-w-[80vw]' }">
        <UButton icon="i-heroicons-bug-ant" color="orange" variant="soft" label="Debug Systems" />

        <template #body>
            <div class="flex gap-6 min-h-0 h-[75vh]">
                <!-- LEFT COLUMN: debug info -->
                <div class="flex-[2] min-w-0 h-full">
                    <CustomScrollbar>
                        <div class="space-y-6 pr-3">

                            <!-- Systems List -->
                            <section>
                                <div class="flex items-center justify-between mb-2">
                                    <h3
                                        class="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <UIcon name="i-heroicons-list-bullet" class="w-4 h-4" />
                                        Loaded Systems ({{ systemStore.systems.length }})
                                    </h3>
                                </div>
                                <div
                                    class="bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700 overflow-hidden">
                                    <div v-for="(sys, index) in systemStore.systems" :key="sys.id" class="p-3 text-xs">
                                        <div class="flex items-center gap-2 mb-1">
                                            <span
                                                class="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded font-mono text-[10px]">{{
                                                index }}</span>
                                            <span class="font-bold">ID: {{ sys.id }}</span>
                                            <span class="text-gray-400 font-mono">({{ typeof sys.id }})</span>
                                        </div>
                                        <div class="text-gray-600 dark:text-gray-400 truncate">{{ sys.name }}</div>
                                    </div>
                                    <div v-if="systemStore.systems.length === 0"
                                        class="p-6 text-center text-gray-500 italic">
                                        No systems loaded in store.
                                    </div>
                                </div>
                            </section>

                            <!-- Pages List -->
                            <section>
                                <div class="flex items-center justify-between mb-2">
                                    <h3
                                        class="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <UIcon name="i-heroicons-document-text" class="w-4 h-4" />
                                        Pages
                                    </h3>
                                    <div class="flex items-center gap-2">
                                        <UButton v-if="systemStore.selectedSystem" icon="i-heroicons-command-line" color="neutral" variant="ghost" size="xs" @click="logPages" title="Log pages to console" />
                                        <UBadge v-if="systemStore.selectedSystem" color="sky" variant="subtle">{{
                                            systemStore.selectedSystem.pages.length }}
                                        </UBadge>
                                    </div>
                                </div>
                                <div v-if="systemStore.selectedSystem"
                                    class="bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700 h-48">
                                    <CustomScrollbar>
                                        <div v-for="page in systemStore.selectedSystem.pages" :key="page.route"
                                            class="p-3 text-xs cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                                            :class="{ 'bg-orange-100 dark:bg-orange-900/30': selectedPage?.route === page.route }"
                                            @click="selectPage(page)">
                                            <div class="flex items-center justify-between gap-4">
                                                <div class="flex flex-col gap-0.5 min-w-0">
                                                    <span class="font-bold truncate text-gray-900 dark:text-white">{{ page.name }}</span>
                                                    <span class="text-gray-500 truncate" v-if="page.description">{{ page.description }}</span>
                                                </div>
                                                <UBadge color="neutral" variant="soft" size="xs" class="font-mono whitespace-nowrap">{{ page.route }}</UBadge>
                                            </div>
                                        </div>
                                        <div v-if="systemStore.selectedSystem.pages.length === 0"
                                            class="p-6 text-center text-gray-500 italic">
                                            No pages registered.
                                        </div>
                                    </CustomScrollbar>
                                </div>
                                <div v-else
                                    class="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 text-center text-gray-500 italic">
                                    Select a system to view pages.
                                </div>
                            </section>

                            <!-- Default Components List -->
                            <section>
                                <div class="flex items-center justify-between mb-2">
                                    <h3
                                        class="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <UIcon name="i-heroicons-puzzle-piece" class="w-4 h-4" />
                                        Default Components
                                    </h3>
                                    <UBadge v-if="systemStore.selectedSystem" color="sky" variant="subtle">{{
                                        systemStore.selectedSystem.defaultComponents.length }}</UBadge>
                                </div>
                                <div v-if="systemStore.selectedSystem"
                                    class="bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700 h-48">
                                    <CustomScrollbar>
                                        <div v-for="comp in systemStore.selectedSystem.defaultComponents" :key="comp.id"
                                            class="p-3 text-xs cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                                            :class="{ 'bg-orange-100 dark:bg-orange-900/30': selectedComponent?.id === comp.id }"
                                            @click="selectComponent(comp)">
                                            <div class="flex items-center gap-2">
                                                <span class="font-bold font-mono">{{ comp.id }}</span>
                                                <span class="text-gray-500 truncate">{{ comp.name }}</span>
                                            </div>
                                        </div>
                                        <div v-if="systemStore.selectedSystem.defaultComponents.length === 0"
                                            class="p-6 text-center text-gray-500 italic">
                                            No components registered.
                                        </div>
                                    </CustomScrollbar>
                                </div>
                                <div v-else
                                    class="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 text-center text-gray-500 italic">
                                    Select a system to view default components.
                                </div>
                            </section>

                            <!-- Selection Info -->
                            <section>
                                <h3
                                    class="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
                                    <UIcon name="i-heroicons-cursor-arrow-rays" class="w-4 h-4" />
                                    Current Selection
                                </h3>
                                <div
                                    class="p-3 bg-teacher-500/5 border border-teacher-500/20 rounded-lg text-xs space-y-2">
                                    <div class="flex justify-between">
                                        <span class="text-gray-500">Selected ID:</span>
                                        <span class="font-mono font-bold"
                                            :class="systemStore.selectedSystemId ? 'text-teacher-600' : 'text-red-500'">
                                            {{ systemStore.selectedSystemId || 'None' }}
                                            <small v-if="systemStore.selectedSystemId" class="text-gray-400 ml-1">({{
                                                typeof
                                                systemStore.selectedSystemId }})</small>
                                        </span>
                                    </div>
                                    <div class="flex justify-between border-t border-teacher-500/10 pt-2">
                                        <span class="text-gray-500">Found in list:</span>
                                        <UBadge :color="systemStore.selectedSystem ? 'green' : 'red'" variant="subtle"
                                            size="xs">
                                            {{ systemStore.selectedSystem ? 'YES' : 'NO' }}
                                        </UBadge>
                                    </div>
                                    <div v-if="systemStore.selectedSystem" class="border-t border-teacher-500/10 pt-2">
                                        <span class="text-gray-500 block mb-1">Details:</span>
                                        <div
                                            class="bg-white/50 dark:bg-black/20 p-2 rounded italic text-gray-700 dark:text-gray-300">
                                            {{ systemStore.selectedSystem.toString() }}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <!-- Selected System — Actual Components -->
                            <section v-if="systemStore.selectedSystem">
                                <div class="flex items-center justify-between mb-2">
                                    <h3
                                        class="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <UIcon name="i-heroicons-puzzle-piece" class="w-4 h-4" />
                                        Actual Components of "{{ systemStore.selectedSystem.name }}"
                                    </h3>
                                    <UBadge color="sky" variant="subtle">{{
                                        systemStore.selectedSystem.actualComponents.length }}</UBadge>
                                </div>
                                <div
                                    class="bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700 h-48">
                                    <CustomScrollbar>
                                        <div v-for="comp in systemStore.selectedSystem.actualComponents" :key="comp.id"
                                            class="p-3 text-xs cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                                            :class="{ 'bg-orange-100 dark:bg-orange-900/30': selectedComponent?.id === comp.id }"
                                            @click="selectComponent(comp)">
                                            <div class="flex items-center gap-2">
                                                <span class="font-bold font-mono">{{ comp.id }}</span>
                                                <span class="text-gray-500 truncate">{{ comp.name }}</span>
                                            </div>
                                        </div>
                                        <div v-if="systemStore.selectedSystem.actualComponents.length === 0"
                                            class="p-6 text-center text-gray-500 italic">
                                            No actual components on this system.
                                        </div>
                                    </CustomScrollbar>
                                </div>
                            </section>

                        </div>
                    </CustomScrollbar>
                </div>

                <!-- DIVIDER -->
                <USeparator orientation="vertical" class="self-stretch" />

                <!-- RIGHT COLUMN: component/page preview -->
                <div class="flex-[4] min-w-0 h-full">
                    <CustomScrollbar>
                        <div class="pr-3">
                            <ComponentPreview :component="selectedComponent" :page="selectedPage" />
                        </div>
                    </CustomScrollbar>
                </div>
            </div>
        </template>
    </UModal>
</template>

<script setup lang="ts">
import { useSystemsStore } from '~/stores/systemsStore'
import type { Component } from '~/model/Component'
import type { Page } from '~/model/Page'

const systemStore = useSystemsStore()

const selectedComponent = ref<Component | null>(null)
const selectedPage = ref<Page | null>(null)

function selectComponent(comp: Component) {
    selectedPage.value = null
    selectedComponent.value = comp
}

function selectPage(page: Page) {
    selectedComponent.value = null
    selectedPage.value = page
}

function logPages() {
    if (systemStore.selectedSystem) {
        //console.log('--- REGISTERED PAGES ---')
        console.table(systemStore.selectedSystem.pages)
        //console.log('Full data:', systemStore.selectedSystem.pages)
    }
}
</script>
