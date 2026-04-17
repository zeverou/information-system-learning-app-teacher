<template>
    <div class="flex flex-wrap items-center gap-2">
        <!-- <DebugButton /> -->

        <!-- In teacher mode: wrap tasks button with a hover popover showing task list -->
        <UButton
            v-if="globalSettings.teacherMode"
            :icon="globalSettings.teacherHighlightEnabled ? 'i-lucide-eye' : 'i-lucide-eye-off'"
            :color="globalSettings.teacherHighlightEnabled ? 'sky' : 'neutral'"
            :variant="globalSettings.teacherHighlightEnabled ? 'soft' : 'ghost'"
            size="md"
            @click="globalSettings.teacherHighlightEnabled = !globalSettings.teacherHighlightEnabled"
        />

        <div
            v-if="globalSettings.teacherMode"
            class="relative"
            @mouseenter="taskPopoverOpen = true"
            @mouseleave="taskPopoverOpen = false"
        >
            <UButton
                icon="i-lucide-clipboard-list"
                color="sky"
                variant="subtle"
                size="md"
                @click="openTaskDesigner"
            >
                <span class="mobile-hidden">{{ t('tasks') }}</span>
            </UButton>
            <div v-show="taskPopoverOpen" class="task-popover">
                <div class="task-popover-inner">
                <button
                    class="task-popover-item task-popover-item--designer"
                    @click="openTaskDesigner"
                >
                    <UIcon name="i-lucide-pencil-ruler" class="w-4 h-4 shrink-0" />
                    {{ t('go_to_designer') }}
                </button>
                <div class="task-popover-separator" />
                <button
                    v-for="task in systemsStore.selectedSystem?.tasks ?? []"
                    :key="task.id"
                    class="task-popover-item"
                    :class="{ 'task-popover-item--active': globalSettings.selectedTaskId === task.id }"
                    @click="openTaskDesignerForTask(task.id)"
                >
                    <UIcon name="i-lucide-circle-dot" class="w-3.5 h-3.5 shrink-0 opacity-60" />
                    <span class="truncate">{{ task.title || t('task_untitled') }}</span>
                </button>
                <div v-if="!(systemsStore.selectedSystem?.tasks?.length)" class="task-popover-empty">
                    {{ t('task_list_empty') }}
                </div>
                </div>
            </div>
        </div>

        <UPopover>
            <!-- <UButton icon="i-heroicons-beaker" color="neutral" variant="ghost" size="md" /> -->
            <template #content>
                <div
                    class="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl min-w-[240px] space-y-2">
                    <UButton block @click="printTableData" variant="soft" color="neutral"
                        icon="i-heroicons-command-line" class="justify-start">
                        Print table names</UButton>
                    <UButton block @click="IsDbNull" variant="soft" color="neutral"
                        icon="i-heroicons-question-mark-circle" class="justify-start">Check DB Status</UButton>
                    <UButton block @click="openComponentExplorer" variant="soft" color="neutral"
                        icon="i-heroicons-magnifying-glass-circle" class="justify-start">Component Explorer</UButton>
                </div>
            </template>
        </UPopover>

        <UButton icon="i-heroicons-table-cells" variant="outline" color="neutral"
            @click="navigateTo(`/systems/${systemsStore.selectedSystemId}/database`)" size="md">
            <span class="mobile-hidden">{{ t('database') }}</span>
        </UButton>

        <div v-if="!globalSettings.teacherMode" class="flex items-center gap-2">
            <!-- Score badge moved to task sidebar header -->
            <!-- <UBadge color="red" variant="subtle" size="lg" class="font-bold px-3">
                {{ $t('score') }}: {{ systemsStore.selectedSystem?.score.score ?? 0 }}
            </UBadge> -->

            <UButton :icon="highlightStore.isHighlightActive ? 'i-lucide-lightbulb' : 'i-lucide-lightbulb-off'"
                color="lime" :variant="highlightStore.isHighlightActive ? 'solid' : 'subtle'" size="md"
                @click="highlightStore.toggleHighlight">
                <span class="mobile-hidden">{{ highlightStore.isHighlightActive ? $t('disable_highlight') :
                    $t('enable_highlight')
                }}</span>
            </UButton>

            <UButton :icon="highlightStore.isEditModeActive ? 'i-lucide-pencil' : 'i-lucide-pencil-off'" color="yellow"
                :variant="highlightStore.isEditModeActive ? 'solid' : 'subtle'" size="md"
                @click="highlightStore.toggleEditMode">
                <span class="mobile-hidden">{{ highlightStore.isEditModeActive ? $t('disable_edit') :
                    $t('enable_edit') }}</span>
            </UButton>

            <!-- Student button removed -->
            <!-- <UDrawer v-model:open="studentDrawerOpen" direction="right">
                <UButton color="sky" variant="subtle" icon="i-lucide-graduation-cap" size="md"
                    @click="studentDrawerOpen = true">
                    <span class="mobile-hidden">{{ $t('student') }}</span>
                </UButton>
                <template #content>
                    <UCard class="h-full border-0 rounded-none overflow-y-auto">
                        <template #header>
                            <div class="flex items-center justify-between">
                                <h3 class="text-xl font-bold">{{ $t('student_guide') }}</h3>
                                <UButton icon="i-lucide-x" color="neutral" variant="ghost"
                                    @click="studentDrawerOpen = false" />
                            </div>
                        </template>
                        <StudentComponent />
                    </UCard>
                </template>
            </UDrawer> -->

            <!-- Settings removed -->
            <!-- <SettingsDrawer /> -->
        </div>

        <UPopover v-model:open="resetPopoverOpen" arrow>
            <UButton icon="i-heroicons-arrow-path" color="primary" variant="subtle" size="md">
                <span class="mobile-hidden">{{ $t('refresh_system') }}</span>
            </UButton>
            <template #content>
                <div class="p-2 flex flex-col gap-1">
                    <UButton block :label="$t('refresh_components')" color="primary" variant="ghost"
                        icon="i-heroicons-squares-2x2" @click="refreshComponents" class="justify-start" />
                    <UButton block :label="$t('refresh_tasks')" color="sky" variant="ghost"
                        icon="i-heroicons-clipboard-document-check" @click="refreshTasks" class="justify-start" />
                    <UButton block :label="$t('refresh_database')" color="orange" variant="ghost"
                        icon="i-heroicons-circle-stack" @click="refreshDatabase" class="justify-start" />
                </div>
            </template>
        </UPopover>

        <UButton v-if="globalSettings.teacherMode" icon="i-heroicons-arrow-right-on-rectangle" color="red" variant="subtle" size="md" @click="leaveSystem">
            <span class="mobile-hidden">{{ $t('leave_system') }}</span>
        </UButton>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SettingsDrawer from '~/components/SettingsDrawer.vue'
import StudentComponent from '~/components/StudentComponent.vue'
import { IndexedDbHandler } from '~/utils/IndexedDbHandler'
import { Task } from '~/model/Task/Task'

const highlightStore = useHighlightStore()
const systemsStore = useSystemsStore()
const globalSettings = useGlobalSettingsStore()

const { t } = useI18n()
const toast = useToast()
const route = useRoute()

const resetPopoverOpen = ref(false)
const exitPopoverOpen = ref(false)
const studentDrawerOpen = ref(false)
const taskPopoverOpen = ref(false)


async function printTableData() {

}

async function IsDbNull() {
    const system = systemsStore.selectedSystem;
    if (system) {
        console.log(system.database === null ? "Database is null." : "Database is not null.");
    } else {
        console.log("No system selected.");
    }
}

function openComponentExplorer() {
    navigateTo(`/systems/${systemsStore.selectedSystemId}/component-explorer`);
}

function openTaskDesigner() {
    taskPopoverOpen.value = false
    navigateTo({
        path: `/systems/${systemsStore.selectedSystemId}/designer`,
        query: {
            backTo: route.fullPath,
        },
    })
}

function openTaskDesignerForTask(taskId: string) {
    globalSettings.selectedTaskId = taskId as any
    taskPopoverOpen.value = false
    navigateTo({
        path: `/systems/${systemsStore.selectedSystemId}/designer`,
        query: {
            backTo: route.fullPath,
            taskId,
        },
    })
}

async function refreshComponents() {
    const system = systemsStore.selectedSystem;
    if (!system) return;
    // TODO 
    //system.actualComponents = JSON.parse(JSON.stringify(system.defaultComponents));
    system.actualComponents = useComponentStore().defaultComponents.map(c => ({ ...c }));
    await systemsStore.updateSystem(system);
    toast.add({ title: t('component_refresh_success') || 'Components refreshed', color: 'primary', icon: 'i-lucide-check-circle' });
}

async function refreshTasks() {
    const system = systemsStore.selectedSystem;
    if (!system) return;
    // Reset tasks to defaults (deep clone to avoid shared references)
    system.tasks = system.defaultTasks.map((t: any) => Task.fromJSON(JSON.parse(JSON.stringify(t))));
    // Reset score
    system.score.reset();
    // Clear solved component IDs
    globalSettings.solvedComponentIds = [];
    await systemsStore.updateSystem(system);
    toast.add({ title: t('refresh_tasks_success'), color: 'primary', icon: 'i-lucide-check-circle' });
    resetPopoverOpen.value = false;
}

async function refreshDatabase() {
    const system = systemsStore.selectedSystem;
    if (!system) return;
    if (system.database) {
        await system.database.resetDatabase();
        await systemsStore.updateSystem(system);
        toast.add({ title: t('database_refresh_success') || 'Database refreshed', color: 'primary', icon: 'i-lucide-check-circle' });
    }


}

async function leaveSystem() {
    await navigateTo('/systems');
    // await SystemReset.refreshComponentsCore();
    // await SystemReset.refreshDatabaseCore();
    // await SystemReset.refreshTasksCore();
}

async function leaveAndSave() {
    try {
        const system = systemsStore.selectedSystem;
        if (!system) throw new Error("No system selected");
        await systemsStore.updateSystem(system);
        if (system.database?.sqlJsDatabase) {
            // database is persisted as part of updateSystem via IndexedDbStorage
        }
        toast.add({
            title: t('save_success') || 'Results saved successfully',
            color: 'primary',
            icon: 'i-lucide-check-circle'
        });
        await navigateTo('/systems');
        // await SystemReset.refreshComponentsCore();
        // await SystemReset.refreshDatabaseCore();
        // await SystemReset.refreshTasksCore();
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

function stayInSystem() {
    exitPopoverOpen.value = false
}
</script>

<style scoped>
@media (max-width: 639px) {
    .mobile-hidden {
        display: none;
    }
}

.task-popover {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 200;
    min-width: 200px;
    max-width: 280px;
    padding-top: 4px;
}

.task-popover-inner {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.12);
    padding: 4px;
    display: flex;
    flex-direction: column;
}

.task-popover-item {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 7px 12px;
    border-radius: 6px;
    font-size: 13px;
    text-align: left;
    cursor: pointer;
    color: #374151;
    background: transparent;
    border: none;
    transition: background 0.15s;
    overflow: hidden;
}

.task-popover-item:hover {
    background: #f3f4f6;
}

.task-popover-item--designer {
    color: #4f46e5;
    font-weight: 500;
}

.task-popover-item--active {
    color: #0ea5e9;
    font-weight: 500;
    background: #f0f9ff;
}

.task-popover-separator {
    height: 1px;
    background: #e5e7eb;
    margin: 4px 0;
}

.task-popover-empty {
    padding: 7px 12px;
    font-size: 12px;
    color: #9ca3af;
    text-align: center;
}
</style>
