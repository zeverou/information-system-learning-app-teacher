<template>
  <div class="flex flex-nowrap items-center gap-2 overflow-x-auto">
    <!-- <DebugButton /> -->

    <!-- In teacher mode: wrap tasks button with a hover popover showing task list -->
    <UButton
      v-if="globalSettings.teacherMode"
      :icon="globalSettings.teacherHighlightEnabled ? 'i-lucide-eye' : 'i-lucide-eye-off'"
      :color="globalSettings.teacherHighlightEnabled ? 'sky' : 'neutral'"
      :variant="globalSettings.teacherHighlightEnabled ? 'soft' : 'ghost'"
      size="md"
      @click="
        globalSettings.teacherHighlightEnabled = !globalSettings.teacherHighlightEnabled
      "
    />

    <UPopover
      v-if="globalSettings.teacherMode"
      v-model:open="taskPopoverOpen"
      arrow
    >
      <UButton
        icon="i-lucide-clipboard-list"
        color="sky"
        variant="subtle"
        size="md"
        @mouseenter="taskPopoverOpen = true"
        @click="openTaskDesigner"
      >
        <span class="mobile-hidden">{{ t("tasks") }}</span>
      </UButton>

      <template #content>
        <div
          class="task-popover-inner"
          @mouseenter="taskPopoverOpen = true"
          @mouseleave="taskPopoverOpen = false"
        >
          <button
            class="task-popover-item task-popover-item--designer"
            @click="openTaskDesigner"
          >
            <UIcon name="i-lucide-pencil-ruler" class="w-4 h-4 shrink-0" />
            {{ t("go_to_designer") }}
          </button>
          <div class="task-popover-separator" />
          <button
            v-for="task in systemsStore.selectedSystem?.tasks ?? []"
            :key="task.id"
            class="task-popover-item"
            :class="{
              'task-popover-item--active': globalSettings.selectedTaskId === task.id,
            }"
            @click="openTaskDesignerForTask(task.id)"
          >
            <UIcon name="i-lucide-circle-dot" class="w-3.5 h-3.5 shrink-0 opacity-60" />
            <span class="truncate">{{ task.title || t("task_untitled") }}</span>
          </button>
          <div
            v-if="!systemsStore.selectedSystem?.tasks?.length"
            class="task-popover-empty"
          >
            {{ t("task_list_empty") }}
          </div>
        </div>
      </template>
    </UPopover>

    <UPopover>
      <!-- <UButton icon="i-heroicons-beaker" color="neutral" variant="ghost" size="md" /> -->
      <template #content>
        <div
          class="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl min-w-[240px] space-y-2"
        >
          <UButton
            block
            @click="printTableData"
            variant="soft"
            color="neutral"
            icon="i-heroicons-command-line"
            class="justify-start"
          >
            Print table names</UButton
          >
          <UButton
            block
            @click="IsDbNull"
            variant="soft"
            color="neutral"
            icon="i-heroicons-question-mark-circle"
            class="justify-start"
            >Check DB Status</UButton
          >
          <UButton
            block
            @click="openComponentExplorer"
            variant="soft"
            color="neutral"
            icon="i-heroicons-magnifying-glass-circle"
            class="justify-start"
            >Component Explorer</UButton
          >
        </div>
      </template>
    </UPopover>

    <div v-if="!globalSettings.teacherMode" class="flex items-center gap-2">
      <!-- Score badge moved to task sidebar header -->
      <!-- <UBadge color="red" variant="subtle" size="lg" class="font-bold px-3">
                {{ $t('score') }}: {{ systemsStore.selectedSystem?.score.score ?? 0 }}
            </UBadge> -->

      <UButton
        :icon="
          highlightStore.isHighlightActive
            ? 'i-lucide-lightbulb'
            : 'i-lucide-lightbulb-off'
        "
        color="lime"
        :variant="highlightStore.isHighlightActive ? 'solid' : 'subtle'"
        size="md"
        @click="highlightStore.toggleHighlight"
      >
        <span class="mobile-hidden">{{
          highlightStore.isHighlightActive
            ? $t("disable_highlight")
            : $t("enable_highlight")
        }}</span>
      </UButton>

      <UButton
        :icon="
          highlightStore.isEditModeActive ? 'i-lucide-pencil' : 'i-lucide-pencil-off'
        "
        color="yellow"
        :variant="highlightStore.isEditModeActive ? 'solid' : 'subtle'"
        size="md"
        @click="highlightStore.toggleEditMode"
      >
        <span class="mobile-hidden">{{
          highlightStore.isEditModeActive ? $t("disable_edit") : $t("enable_edit")
        }}</span>
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

    <UButton
      :label="$t('refresh_system')"
      size="md"
      color="green"
      variant="subtle"
      icon="i-lucide-refresh-cw"
      @click="openRefreshSystemModal"
    />

    <!-- <UPopover v-model:open="resetPopoverOpen" arrow>
            <UButton icon="i-heroicons-arrow-path" color="primary" variant="subtle" size="md">
                <span class="mobile-hidden">{{ $t('refresh_system') }}</span>
            </UButton>
            <template #content>
                <div class="p-2 flex flex-col gap-1">
                    <UButton block :label="$t('refresh_system')" color="green" variant="ghost"
                        icon="i-lucide-refresh-cw" @click="refreshSystem" class="justify-start" />
                    <UButton block :label="$t('refresh_components')" color="primary" variant="ghost"
                        icon="i-heroicons-squares-2x2" @click="refreshComponents" class="justify-start" />
                    <UButton block :label="$t('refresh_tasks')" color="sky" variant="ghost"
                        icon="i-heroicons-clipboard-document-check" @click="refreshTasks" class="justify-start" />
                    <UButton block :label="$t('refresh_database')" color="orange" variant="ghost"
                        icon="i-heroicons-circle-stack" @click="refreshDatabase" class="justify-start" />
                </div>
            </template>
        </UPopover> -->

    <UButton
      v-if="globalSettings.teacherMode"
      icon="i-heroicons-arrow-right-on-rectangle"
      color="red"
      variant="subtle"
      size="md"
      @click="leaveSystem"
    >
      <span class="mobile-hidden">{{ $t("leave_system") }}</span>
    </UButton>

    <UModal
      v-model:open="refreshSystemModalOpen"
      :title="t('refresh_system_modal_title')"
      :ui="{ content: 'w-[460px]' }"
    >
      <template #body>
        <div class="flex flex-col gap-4">
          <p class="text-sm text-gray-600 dark:text-gray-300">
            {{ t("refresh_system_modal_description") }}
          </p>

          <div class="flex flex-col gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-800">
            <label class="flex items-center justify-between gap-3">
              <span class="flex min-w-0 flex-col">
                <span class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ t("refresh_database") }}
                </span>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {{ t("refresh_database_modal_option_description") }}
                </span>
              </span>
              <USwitch v-model="refreshDatabaseEnabled" color="green" />
            </label>

            <label class="flex items-center justify-between gap-3">
              <span class="flex min-w-0 flex-col">
                <span class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ t("refresh_tasks") }}
                </span>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {{ t("refresh_tasks_modal_option_description") }}
                </span>
              </span>
              <USwitch v-model="refreshTasksEnabled" color="green" />
            </label>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton color="neutral" variant="ghost" @click="refreshSystemModalOpen = false">
            {{ t("cancel") }}
          </UButton>
          <UButton color="green" icon="i-lucide-refresh-cw" @click="confirmRefreshSystem">
            {{ t("refresh_system") }}
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import SettingsDrawer from "~/components/SettingsDrawer.vue";
import StudentComponent from "~/components/StudentComponent.vue";
import { IndexedDbHandler } from "~/utils/IndexedDbHandler";
import { OperationResultType } from "~/utils/OperationResultType";
import { Task } from "~/model/Task/Task";
import { Component } from "~/model/Component";

const highlightStore = useHighlightStore();
const systemsStore = useSystemsStore();
const globalSettings = useGlobalSettingsStore();

const { t } = useI18n();
const toast = useToast();
const route = useRoute();
const preloadedSystems = usePreloadedSystems();
const { pushFirstAvailablePage } = useAvailableSystemPages();

const resetPopoverOpen = ref(false);
const exitPopoverOpen = ref(false);
const studentDrawerOpen = ref(false);
const taskPopoverOpen = ref(false);
const refreshSystemModalOpen = ref(false);
const refreshDatabaseEnabled = ref(true);
const refreshTasksEnabled = ref(true);

async function printTableData() {}

async function IsDbNull() {
  const system = systemsStore.selectedSystem;
  if (system) {
    //console.log(system.database === null ? "Database is null." : "Database is not null.");
  } else {
    //console.log("No system selected.");
  }
}

function openComponentExplorer() {
  navigateTo(`/systems/${systemsStore.selectedSystemId}/component-explorer`);
}

function openTaskDesigner() {
  taskPopoverOpen.value = false;
  navigateTo({
    path: `/systems/${systemsStore.selectedSystemId}/designer`,
    query: {
      backTo: route.fullPath,
    },
  });
}

function openTaskDesignerForTask(taskId: string) {
  const isSelected = globalSettings.selectedTaskId === taskId;
  globalSettings.selectedTaskId = isSelected ? null : (taskId as any);
  taskPopoverOpen.value = false;
  navigateTo({
    path: `/systems/${systemsStore.selectedSystemId}/designer`,
    query: {
      backTo: route.fullPath,
      ...(isSelected ? {} : { taskId }),
    },
  });
}

function openRefreshSystemModal() {
  refreshDatabaseEnabled.value = true;
  refreshTasksEnabled.value = true;
  refreshSystemModalOpen.value = true;
}

async function refreshComponents() {
  const system = systemsStore.selectedSystem;
  if (!system) return;
  system.actualComponents = system.defaultComponents.map((c) =>
    Component.fromJSON(JSON.parse(JSON.stringify(c)))
  );
  await systemsStore.updateSystem(system);
  toast.add({
    title: t("component_refresh_success") || "Components refreshed",
    color: "primary",
    icon: "i-lucide-check-circle",
  });
}

async function refreshSystem() {
  const currentSystemId = systemsStore.selectedSystemId;
  if (!currentSystemId) {
    return;
  }

  try {
    await preloadedSystems.load();
    const freshSystem = preloadedSystems.systems.value.find(
      (system) => String(system.id) === String(currentSystemId)
    );

    if (!freshSystem) {
      toast.add({
        title: t("refresh_system_error"),
        color: "red",
        icon: "i-lucide-alert-triangle",
      });
      resetPopoverOpen.value = false;
      return;
    }

    globalSettings.selectedTaskId = null;
    globalSettings.solvedComponentIds = [];

    const result = await systemsStore.updateSystem(freshSystem);
    if (result.result !== OperationResultType.SUCCESS) {
      toast.add({
        title: t("refresh_system_error"),
        color: "red",
        icon: "i-lucide-alert-triangle",
      });
      resetPopoverOpen.value = false;
      return;
    }

    systemsStore.selectedSystemId = String(freshSystem.id);
    toast.add({
      title: t("refresh_system_success"),
      color: "primary",
      icon: "i-lucide-check-circle",
    });
  } catch (error) {
    console.error("System refresh failed:", error);
    toast.add({
      title: t("refresh_system_error"),
      color: "red",
      icon: "i-lucide-alert-triangle",
    });
  } finally {
    resetPopoverOpen.value = false;
  }
}

async function confirmRefreshSystem() {
  refreshSystemModalOpen.value = false;

  if (refreshDatabaseEnabled.value && refreshTasksEnabled.value) {
    await refreshSystem();
    await pushFirstAvailablePage(null);
    return;
  }

  await refreshComponents();

  if (refreshTasksEnabled.value) {
    await refreshTasks();
  }

  if (refreshDatabaseEnabled.value) {
    await refreshDatabase();
  }

  await pushFirstAvailablePage(null);
}

async function refreshTasks() {
  const system = systemsStore.selectedSystem;
  if (!system) return;
  // Reset tasks to defaults (deep clone to avoid shared references)
  system.tasks = system.defaultTasks.map((t: any) =>
    Task.fromJSON(JSON.parse(JSON.stringify(t)))
  );
  // Reset score
  system.score.reset();
  system.currentRound = 1;
  // Clear solved component IDs
  globalSettings.solvedComponentIds = [];
  globalSettings.selectedTaskId = null;
  await systemsStore.updateSystem(system);
  toast.add({
    title: t("refresh_tasks_success"),
    color: "primary",
    icon: "i-lucide-check-circle",
  });
  resetPopoverOpen.value = false;
}

async function refreshDatabase() {
  const system = systemsStore.selectedSystem;
  if (!system) return;
  if (system.database) {
    await system.database.resetDatabase();
    await systemsStore.updateSystem(system);
    toast.add({
      title: t("refresh_database_success") || "Database refreshed",
      color: "primary",
      icon: "i-lucide-check-circle",
    });
  }
}

async function leaveSystem() {
  await navigateTo("/systems");
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
      title: t("save_success") || "Results saved successfully",
      color: "primary",
      icon: "i-lucide-check-circle",
    });
    await navigateTo("/systems");
    // await SystemReset.refreshComponentsCore();
    // await SystemReset.refreshDatabaseCore();
    // await SystemReset.refreshTasksCore();
    exitPopoverOpen.value = false;
  } catch (error) {
    console.error("Save failed:", error);
    toast.add({
      title: t("save_error") || "Save failed",
      color: "red",
      icon: "i-lucide-alert-triangle",
    });
  }
}

function stayInSystem() {
  exitPopoverOpen.value = false;
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
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
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
