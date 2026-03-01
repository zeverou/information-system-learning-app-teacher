<template>
    <div class="flex items-center gap-2">
        <UPopover>
            <UButton icon="i-heroicons-beaker" color="neutral" variant="ghost" size="md" />
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
            @click="navigateTo(`/systems/${selectedSystemStore.selectedId}/database`)" size="md">
            <span class="mobile-hidden">{{ t('database') }}</span>
        </UButton>

        <UBadge color="red" variant="subtle" size="lg" class="font-bold px-3">
            {{ $t('score') }}: {{ scoreStore.score }}
        </UBadge>

        <UButton :icon="highlightStore.isHighlightMode ? 'i-lucide-lightbulb' : 'i-lucide-lightbulb-off'" color="lime"
            :variant="highlightStore.isHighlightMode ? 'solid' : 'subtle'" size="md"
            @click="highlightStore.toggleHighlight">
            <span class="mobile-hidden">{{ highlightStore.isHighlightMode ? $t('disable_highlight') :
                $t('enable_highlight')
                }}</span>
        </UButton>

        <UButton :icon="highlightStore.isEditModeActive ? 'i-lucide-pencil' : 'i-lucide-pencil-off'" color="yellow"
            :variant="highlightStore.isEditModeActive ? 'solid' : 'subtle'" size="md"
            @click="highlightStore.toggleEdit">
            <span class="mobile-hidden">{{ highlightStore.isEditModeActive ? $t('disable_edit') :
                $t('enable_edit') }}</span>
        </UButton>

        <UDrawer v-model:open="studentDrawerOpen" direction="right">
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
        </UDrawer>

        <SettingsDrawer />

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

        <UPopover v-model:open="exitPopoverOpen" arrow>
            <UButton icon="i-heroicons-arrow-right-on-rectangle" color="red" variant="subtle" size="md">
                <span class="mobile-hidden">{{ $t('exit_system') }}</span>
            </UButton>
            <template #content>
                <div class="p-3 flex flex-col gap-2 min-w-[200px]">
                    <UButton block :label="$t('leave_system')" color="red" variant="soft"
                        icon="i-heroicons-arrow-left-on-rectangle" @click="leaveSystem" class="justify-start" />
                    <UButton block :label="$t('leave_and_save')" color="yellow" variant="soft"
                        icon="i-heroicons-document-check" @click="leaveAndSave" class="justify-start" />
                    <UButton block :label="$t('stay_in_system')" color="neutral" variant="ghost"
                        icon="i-heroicons-x-mark" @click="stayInSystem" class="justify-start" />
                </div>
            </template>
        </UPopover>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useHighlightStore } from '~/stores/useHighlightStore'
import { SystemReset, useScoreStore, useSelectedSystemStore, useSelectedTaskStore, useTaskMenuStore } from '#imports'
import SettingsDrawer from '~/components/SettingsDrawer.vue'
import StudentComponent from '~/components/StudentComponent.vue'
import { IndexedDbHandler } from '~/utils/IndexedDbHandler'

const highlightStore = useHighlightStore()
const scoreStore = useScoreStore()
const selectedSystemStore = useSelectedSystemStore()
const selectedTaskStore = useSelectedTaskStore()
const taskMenuStore = useTaskMenuStore()

const { t } = useI18n()
const toast = useToast()

const resetPopoverOpen = ref(false)
const exitPopoverOpen = ref(false)
const studentDrawerOpen = ref(false)

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

async function leaveSystem() {
    await navigateTo('/systems');
    await SystemReset.refreshComponentsCore();
    await SystemReset.refreshDatabaseCore();
    await SystemReset.refreshTasksCore();
    exitPopoverOpen.value = false;
}

async function leaveAndSave() {
    try {
        const system = selectedSystemStore.selectedSystem;
        if (!system) throw new Error("No system selected");
        await IndexedDbHandler.saveInformationSystem(system);
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
</style>
