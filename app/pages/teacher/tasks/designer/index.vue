<template>
    <div class="flex h-full overflow-hidden divide-x divide-gray-200 dark:divide-gray-700">
        <!-- Column 1 -->
        <div class="flex-1 overflow-y-auto p-4">
            <UCard class="border-t-4 border-teacher-500 shadow-lg dark:bg-gray-900/50">
                <div class="flex items-center gap-4">
                    <div class="shrink-0 p-2 bg-teacher-500/10 rounded-lg text-teacher-500">
                        <UIcon name="i-lucide-pencil-ruler" class="w-6 h-6" />
                    </div>

                    <div class="flex-1 min-w-0">
                        <h1 class="text-base font-bold text-gray-900 dark:text-white">
                            {{ t('task_designer') }}
                        </h1>
                        <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                            {{ t('task_designer_description') }}
                        </p>
                    </div>

                    <UButton icon="i-lucide-arrow-left" color="teacher" variant="outline" size="sm"
                        @click="navigateTo('/teacher/tasks')">
                        {{ t('back_to_tasks') }}
                    </UButton>
                </div>
            </UCard>
        </div>

        <!-- Column 2 -->
        <div class="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            <UCard class="shadow-lg dark:bg-gray-900/50">
                <div class="flex items-center gap-3">
                    <div class="shrink-0 p-2 bg-teacher-500/10 rounded-lg text-teacher-500">
                        <UIcon name="i-heroicons-computer-desktop" class="w-5 h-5" />
                    </div>
                    <h2 class="text-sm font-semibold text-gray-900 dark:text-white shrink-0">{{ t('information_systems') }}</h2>
                    <div class="flex-1">
                        <USelect v-model="selectedSystemId" :items="systemOptions" option-attribute="label" value-attribute="value" class="w-full" />
                    </div>
                </div>
            </UCard>

            <UCard class="shadow-lg dark:bg-gray-900/50 flex-1 overflow-hidden" :ui="{ body: 'h-full flex flex-col p-0 overflow-hidden' }">
                <!-- Card header label -->
                <div class="px-4 py-2 border-b border-gray-100 dark:border-gray-800 shrink-0">
                    <span class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{{ t('components') }}</span>
                </div>

                <div v-if="defaultComponents.length === 0" class="flex items-center justify-center flex-1 text-sm text-gray-400 dark:text-gray-500">
                    No system selected
                </div>
                <ul v-else class="divide-y divide-gray-100 dark:divide-gray-800 overflow-y-auto flex-1">
                    <li v-for="component in defaultComponents" :key="component.id"
                        class="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                        :class="{ 'bg-teacher-500/10': selectedComponent?.id === component.id }"
                        @click="selectedComponent = component">
                        <span class="text-xs font-mono text-gray-400 dark:text-gray-500 shrink-0 w-28 truncate">{{ component.id }}</span>
                        <span class="text-sm text-gray-900 dark:text-white truncate">{{ component.name }}</span>
                    </li>
                </ul>
            </UCard>
        </div>

        <!-- Column 3 -->
        <div class="flex-1 overflow-y-auto p-4">
            <div v-if="!selectedComponent" class="flex items-center justify-center h-full text-sm text-gray-400 dark:text-gray-500">
                Select a component to view details
            </div>
            <div v-else class="flex flex-col gap-4">
                <!-- Meta -->
                <UCard class="shadow-lg dark:bg-gray-900/50">
                    <div class="flex flex-col gap-2">
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 w-10">ID</span>
                            <span class="text-xs font-mono text-gray-700 dark:text-gray-300">{{ selectedComponent.id }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 w-10">Name</span>
                            <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ selectedComponent.name }}</span>
                        </div>
                        <div v-if="selectedComponent.tags?.length" class="flex items-center gap-2 flex-wrap">
                            <span class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 w-10">Tags</span>
                            <UBadge v-for="tag in selectedComponent.tags" :key="tag" color="teacher" variant="subtle" size="sm">{{ tag }}</UBadge>
                        </div>
                    </div>
                </UCard>

                <!-- HTML -->
                <CodeBlock v-if="selectedComponent.html" :code="selectedComponent.html" language="html" label="HTML" height="200px" :read-only="true" :correct="undefined" />

                <!-- CSS -->
                <CodeBlock v-if="selectedComponent.css" :code="selectedComponent.css" language="css" label="CSS" height="150px" :read-only="true" :correct="undefined" />

                <!-- JS -->
                <CodeBlock v-if="selectedComponent.js" :code="selectedComponent.js" language="javascript" label="JS" height="150px" :read-only="true" :correct="undefined" />

                <!-- SQL -->
                <template v-if="Object.keys(selectedComponent.sql ?? {}).length">
                    <CodeBlock v-for="(query, key) in selectedComponent.sql" :key="key" :code="query" language="sql" :label="'SQL: ' + key" height="150px" :read-only="true" :correct="undefined" />
                </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Component } from '~/model/Component'

const { t } = useI18n()
const systemsStore = useSystemsStore()

const selectedSystemId = ref<GUID | undefined>(undefined)
const selectedComponent = ref<Component | null>(null)

const systemOptions = computed(() =>
    systemsStore.systems.map(s => ({ label: s.name, value: s.id }))
)

const defaultComponents = computed(() =>
    systemsStore.systems.find(s => s.id === selectedSystemId.value)?.defaultComponents ?? []
)
</script>
