<template>
    <div class="w-full" style="z-index: 10000;">
        <!-- Main navbar container with flex wrap -->
        <div class="flex flex-wrap items-center justify-between gap-2 py-2">

            <!-- Navigation Menu on the left -->
            <div class="flex-shrink-0">
                <UNavigationMenu orientation="horizontal" :items="localItems"
                    class="data-[orientation=vertical]:w-48" />
            </div>
        </div>
    </div>

    <!-- Floating Button -->
    <UPopover v-if="!taskMenuStore.taskMenuDisplayedAsSidebar" v-model:open="tasksPopoverOpen" arrow style="z-index: 10001;">
        <UButton style="z-index: 10001;" icon="i-lucide-list-todo"
            :label="selectedTaskStore.selectedTask?.title || $t('tasks')" color="lime" variant="solid" size="xl"
            :class="['fixed bottom-15 right-15 rounded-full shadow-lg', { 'task-button-animation': selectedTaskStore.selectedTask }]">
            <span class="mobile-hidden">{{ selectedTaskStore.selectedTask?.title || $t('tasks') }}</span>
        </UButton>
        <template #content>
            <TaskList />
        </template>
    </UPopover>
</template>

<style scoped>
/* Hide button labels on mobile screens */
@media (max-width: 639px) {
    .mobile-hidden {
        display: none;
    }
}
</style>

<script setup lang="ts">
/* 1. Imports */
import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { NavigationMenuItem } from '@nuxt/ui'
import { useHighlightStore } from '~/stores/useHighlightStore'
import { ComponentHandler, SystemReset, TaskAnswerEval, TaskQueue, useScoreStore } from '#imports'
import { useErrorComponentStore } from '#imports'
import { Task } from '~/model/Task'
import { useSelectedTaskStore } from '#imports'
import { useSelectedSystemStore } from '#imports'
import { useSettingsStore } from '#imports'
import { useInformationSystemStore } from '#imports'
import { useComponentCodeStore } from '#imports'
import type { InformationSystem } from '~/model/InformationSystem'
import SettingsDrawer from '~/components/SettingsDrawer.vue'
import TeacherComponent from '~/components/TeacherComponent.vue'
import StudentComponent from '~/components/StudentComponent.vue'
import { IndexedDbHandler } from '~/utils/IndexedDbHandler'

/* 2. Stores */
const highlightStore = useHighlightStore()
const scoreStore = useScoreStore()
const errorComponentStore = useErrorComponentStore()
const selectedTaskStore = useSelectedTaskStore()
const selectedSystemStore = useSelectedSystemStore()
const settingsStore = useSettingsStore()
const informationSystemStore = useInformationSystemStore()
const componentCodeStore = useComponentCodeStore()
const taskMenuStore = useTaskMenuStore()

/* 3. Context hooks */
const { t, locale } = useI18n()

/* 4. Constants (non-reactive) */
const toast = useToast()

/* 5. Props */
// none

/* 6. Emits */
// none

/* 7. Template refs */
// none

/* 8. Local state (ref, reactive) */
const tasksPopoverOpen = ref(false)
const resetPopoverOpen = ref(false)
const exitPopoverOpen = ref(false)
const teacherDrawerOpen = ref(false)
const studentDrawerOpen = ref(false)

const localItems = computed<NavigationMenuItem[]>(() => {
    // Access locale.value so the computed updates when the locale changes
    void locale.value

    return [
    {
        label: t('dashboard'),
        icon: 'i-heroicons-chart-bar-20-solid',
        to: `/systems/${selectedSystemStore.selectedId}/dashboard`,
        data_target: 'system-dashboard',
    },
    {
        label: t('sessions'),
        icon: 'i-heroicons-calendar-date-range',
        to: `/systems/${selectedSystemStore.selectedId}/sessions`,
        data_target: 'system-sessions',
    },
    {
        label: t('participants'),
        icon: 'i-heroicons-users',
        to: `/systems/${selectedSystemStore.selectedId}/participants`,
        data_target: 'system-participants',
    },
    {
        label: t('supervisors'),
        icon: 'i-heroicons-user-group',
        to: `/systems/${selectedSystemStore.selectedId}/supervisors`,
        data_target: 'system-supervisors',
    },
    {
        label: t('meals'),
        icon: 'i-lucide-utensils',
        to: `/systems/${selectedSystemStore.selectedId}/meals`,
        data_target: 'system-meals',
    },
    {
        label: t('meal_plan'),
        icon: 'i-lucide-square-menu',
        to: `/systems/${selectedSystemStore.selectedId}/meal-plan`,
        data_target: 'system-meal-plan',
    },


    ]
})

/* 9. Computed */
// none

/* 10. Watchers */
// Keyboard shortcut for highlight toggle
onMounted(() => {
    const handleKeydown = (event: KeyboardEvent) => {
        if (event.key === 'q' && event.altKey) {
            highlightStore.toggleHighlight()
        }
        if (event.key === 'w' && event.altKey) {
            highlightStore.toggleEdit()
        }
        if (event.key === 't' && event.altKey) {
            event.preventDefault()
            tasksPopoverOpen.value = !tasksPopoverOpen.value
        }
    }

    document.addEventListener('keydown', handleKeydown)

    onUnmounted(() => {
        document.removeEventListener('keydown', handleKeydown)
    })
})

/* 11. Methods */
async function handleHelperClick() {
    /*
    console.log("Helper button clicked");
    console.log(ComponentHandler.isInErrorComponents("stats-supervisors"));
    console.log(componentCodeStore.getComponentById("stats-supervisors"));
    */
    console.log("Current error components:", errorComponentStore.errorComponents);
}

async function printTableData() {
    if (selectedSystemStore.selectedSystem && selectedSystemStore.selectedSystem.db) {
        const tableNames: string[] = selectedSystemStore.selectedSystem.db.getAllTableNames();
        for (const tableName of tableNames) {
            const data = await selectedSystemStore.selectedSystem.db.query(`SELECT * FROM ${tableName} LIMIT 5`);
            console.log(`Table: ${tableName}`, data);
        }
    }
}

async function IsDbNull() {
    if (selectedSystemStore.selectedSystem) {
        console.log(selectedSystemStore.selectedSystem.db === null ? "Database is null." : "Database is not null.");
    } else {
        console.log("No system selected.");
    }
}

function openComponentExplorer() {
    navigateTo(`/systems/${selectedSystemStore.selectedId}/component-explorer`);
}


// Wrapper methods with toasts
async function refreshComponents() {
    try {
        await SystemReset.refreshComponentsCore();
        toast.add({
            title: t('component_refresh_success') || 'Component refresh successful',
            color: 'primary',
            icon: 'i-lucide-check-circle'
        })
    } catch {
        toast.add({
            title: t('component_refresh_error') || 'Component refresh error',
            color: 'red',
            icon: 'i-lucide-alert-triangle'
        })
    }
}

async function refreshTasks() {
    try {
        await SystemReset.refreshTasksCore();
        toast.add({
            title: t('refresh_tasks_success') || 'Tasks refreshed successfully',
            color: 'primary',
            icon: 'i-lucide-check-circle'
        })
    } catch {
        toast.add({
            title: t('refresh_tasks_error') || 'Tasks refresh error',
            color: 'red',
            icon: 'i-lucide-alert-triangle'
        })
    }
}

async function refreshDatabase() {
    try {
        await SystemReset.refreshDatabaseCore();
        toast.add({
            title: t('refresh_database_success') || 'Database refreshed successfully',
            color: 'primary',
            icon: 'i-lucide-check-circle'
        })
    } catch {
        toast.add({
            title: t('refresh_database_error') || 'Database refresh error',
            color: 'red',
            icon: 'i-lucide-alert-triangle'
        })
    }
}

async function refreshAll() {
    await refreshComponents()
    await refreshDatabase()
    await refreshTasks()
}

async function leaveSystem() {
    // Navigate back to systems list
    await navigateTo('/systems');
    await SystemReset.refreshComponentsCore();
    await SystemReset.refreshDatabaseCore();
    await SystemReset.refreshTasksCore();
    exitPopoverOpen.value = false;
}

async function leaveAndSave() {
    try {
        const system = selectedSystemStore.selectedSystem;
        if (!system) {
            throw new Error("No system selected");
        }

        // Save the InformationSystem object
        await IndexedDbHandler.saveInformationSystem(system);

        // Save the database if it exists
        if (system.db) {
            const dbData = system.db.exportDatabase();
            await IndexedDbHandler.saveSystemDB(system.id, dbData);
        }

        toast.add({
            title: t('save_success') || 'Results saved successfully',
            color: 'primary',
            icon: 'i-lucide-check-circle'
        });

        await navigateTo('/systems');
        await SystemReset.refreshComponentsCore();
        await SystemReset.refreshDatabaseCore();
        await SystemReset.refreshTasksCore();
        exitPopoverOpen.value = false;
    } catch (error) {
        console.error("Save failed:", error);
        toast.add({
            title: t('save_error') || 'Save failed',
            color: 'red',
            icon: 'i-lucide-alert-triangle'
        });
    }
}

async function stayInSystem() {
    // Just close the popover
    exitPopoverOpen.value = false
}

/* 12. Lifecycle */
// none

/* 13. defineExpose */
// none
</script>
