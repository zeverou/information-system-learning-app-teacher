<template>
    <div
        class="context-menu-footer w-full py-2 px-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-2 justify-center flex-nowrap">
            <UPopover>
                <!-- <UButton label="Helper" color="neutral" variant="subtle" /> -->
                <template #content>
                    <div style="min-width: 300px; border: 1px transparent; border-radius: 8px; padding: 10px;">
                        <UButton block class="mb-2 justify-start" @click="printTableData" variant="soft">Print database
                            table names</UButton>
                        <UButton block class="mb-2 justify-start" @click="IsDbNull" variant="soft">Check if db is null
                        </UButton>
                        <UButton block class="mb-2 justify-start" @click="openComponentExplorer" variant="soft">Open
                            Component Explorer</UButton>
                    </div>
                </template>
            </UPopover>

            <UButton icon="i-heroicons-table-cells" variant="outline"
                @click="navigateTo(`/systems/${selectedSystemStore.selectedId}/database`)" size="md">{{
                    t('database') }}</UButton>

            <UBadge color="red" variant="outline" size="xl">
                {{ $t('score') }}: {{ scoreStore.score }}
            </UBadge>

            <UButton :icon="highlightStore.isHighlightMode ? 'i-lucide-lightbulb' : 'i-lucide-lightbulb-off'"
                :label="highlightStore.isHighlightMode ? $t('disable_highlight') : $t('enable_highlight')" color="lime"
                :variant="highlightStore.isHighlightMode ? 'solid' : 'subtle'" size="md"
                @click="highlightStore.toggleHighlight">
                <span class="mobile-hidden">{{ highlightStore.isHighlightMode ? $t('disable_highlight') :
                    $t('enable_highlight')
                    }}</span>
            </UButton>

            <UButton :icon="highlightStore.isEditModeActive ? 'i-lucide-pencil' : 'i-lucide-pencil-off'"
                :label="highlightStore.isEditModeActive ? $t('disable_edit') : $t('enable_edit')" color="yellow"
                :variant="highlightStore.isEditModeActive ? 'solid' : 'subtle'" size="md"
                @click="highlightStore.toggleEdit">
                <span class="mobile-hidden">{{ highlightStore.isEditModeActive ? $t('disable_edit') :
                    $t('enable_edit')
                    }}</span>
            </UButton>

            <UDrawer v-model:open="studentDrawerOpen" direction="right">
                <UButton color="sky" variant="outline" @click="studentDrawerOpen = true" icon="i-lucide-graduation-cap"
                    size="md">
                    <span class="mobile-hidden">{{ $t('student') }}</span>
                </UButton>
                <template #content>
                    <UCard class="p-4 min-w-96 max-h-screen overflow-y-auto">
                        <template #header>
                            <div class="flex items-center justify-between">
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
                <UButton icon="i-heroicons-arrow-path" :label="$t('refresh_system')" color="primary" variant="subtle"
                    size="md">
                    <span class="mobile-hidden">{{ $t('refresh_system') }}</span>
                </UButton>
                <template #content>
                    <UCard>
                        <div class="flex flex-col gap-2">
                            <UButton block :label="$t('refresh_components')" color="primary" variant="outline"
                                icon="i-heroicons-arrow-path" @click="refreshComponents" class="justify-start" />
                            <UButton block :label="$t('refresh_tasks')" color="sky" variant="outline"
                                icon="i-heroicons-arrow-path" @click="refreshTasks" class="justify-start" />
                        </div>
                    </UCard>
                </template>
            </UPopover>

            <UPopover v-model:open="exitPopoverOpen" arrow>
                <UButton icon="i-heroicons-arrow-right-on-rectangle" :label="$t('exit_system')" color="red"
                    variant="subtle" size="md">
                    <span class="mobile-hidden">{{ $t('exit_system') }}</span>
                </UButton>
                <template #content>
                    <UCard>
                        <div class="flex flex-col gap-2">
                            <UButton block size="md" :label="$t('leave_system')" color="red" variant="outline"
                                icon="i-heroicons-arrow-right-on-rectangle" @click="leaveSystem"
                                class="justify-start" />
                            <UButton block size="md" :label="$t('leave_and_save')" color="yellow" variant="outline"
                                icon="i-heroicons-document-check" @click="leaveAndSave" class="justify-start" />
                            <UButton block size="md" :label="$t('stay_in_system')" color="neutral" variant="outline"
                                icon="i-heroicons-x-mark" @click="stayInSystem" class="justify-start" />
                        </div>
                    </UCard>
                </template>
            </UPopover>
        </div>
    </div>
</template>

<style scoped>
/* Hide button labels on mobile screens */
@media (max-width: 639px) {
    .mobile-hidden {
        display: none;
    }
}

.context-menu-footer {
    position: sticky;
    bottom: 0;
    z-index: 100;
}

.context-menu-footer :deep(button),
.context-menu-footer :deep(.flex > *) {
    flex: 1;
}
</style>

<script setup lang="ts">
/* 1. Imports */
import { ref } from 'vue'
import { useHighlightStore } from '~/stores/useHighlightStore'
import { SystemReset, useScoreStore } from '#imports'
import { useSelectedSystemStore } from '#imports'
import SettingsDrawer from '~/components/SettingsDrawer.vue'
import StudentComponent from '~/components/StudentComponent.vue'
import { IndexedDbHandler } from '~/utils/IndexedDbHandler'

/* 2. Stores */
const highlightStore = useHighlightStore()
const scoreStore = useScoreStore()
const selectedSystemStore = useSelectedSystemStore()

/* 3. Context hooks */
const { t } = useI18n()

/* 4. Constants (non-reactive) */
const toast = useToast()

/* 5. Props */
// none

/* 6. Emits */
// none

/* 7. Template refs */
// none

/* 8. Local state (ref, reactive) */
const resetPopoverOpen = ref(false)
const exitPopoverOpen = ref(false)
const studentDrawerOpen = ref(false)

/* 9. Computed */
// none

/* 10. Watchers */
// none

/* 11. Methods */
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
        if (!system) {
            throw new Error("No system selected");
        }

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

async function stayInSystem() {
    exitPopoverOpen.value = false
}

/* 12. Lifecycle */
// none

/* 13. defineExpose */
// none
</script>
