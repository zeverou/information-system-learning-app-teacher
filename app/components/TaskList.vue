<template>
  <div class="flex flex-col">
    <!-- Task detail view -->
    <div v-if="selectedTask" class="flex flex-col p-4 gap-4">
      <UButton
        icon="i-lucide-arrow-left"
        variant="ghost"
        color="neutral"
        size="sm"
        class="self-start"
        @click="closeTask"
      >
        {{ t('back_to_tasks') }}
      </UButton>
      <TaskStudentDetail :task="selectedTask" />
    </div>

    <!-- Task list view -->
    <div v-else class="flex flex-col p-4 gap-2">
      <div v-if="!tasks.length" class="flex flex-col items-center py-8 text-center gap-2">
        <UIcon name="i-lucide-clipboard-list" class="w-10 h-10 text-gray-300 dark:text-gray-600" />
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('task_list_empty') }}</p>
      </div>

      <template v-for="(task, index) in tasks" :key="task.id">
        <!-- Level Divider -->
        <div v-if="index === 0 || task.round !== tasks[index - 1].round" class="flex items-center py-3 first:pt-1">
          <span class="pr-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
            {{ t('task_level') }} {{ task.round }}
          </span>
          <div class="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
        </div>

        <ModernHoverPopover
          v-if="isTaskLocked(task)"
          class="w-full"
          :title="t('task_level_locked_title')"
          :description="t('task_level_locked_description')"
          icon="i-lucide-lock"
        >
          <button
            type="button"
            aria-disabled="true"
            class="flex w-full cursor-not-allowed flex-col gap-1.5 rounded-lg border border-gray-200 bg-gray-50 p-3 text-left opacity-60 dark:border-gray-700 dark:bg-gray-800/50"
            @click.prevent
          >
            <div class="flex items-start justify-between gap-2">
              <div class="flex min-w-0 flex-col gap-1">
                <span class="font-medium text-sm text-gray-900 dark:text-white leading-snug">{{ task.title }}</span>
                <span class="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {{ t('task_level') }} {{ task.round }}
                </span>
              </div>
              <span
                role="checkbox"
                :aria-checked="isTaskDone(task)"
                :aria-label="t('task_completed')"
                class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-colors"
                :class="isTaskDone(task)
                  ? 'border-green-500 bg-green-500 dark:border-green-400 dark:bg-green-400'
                  : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-900'"
              >
                <UIcon v-if="isTaskDone(task)" name="i-lucide-check" class="h-3 w-3 text-white" />
              </span>
            </div>
          </button>
        </ModernHoverPopover>

        <button
          v-else
          class="flex flex-col gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer w-full"
          @click="openTask(task)"
        >
          <div class="flex items-start justify-between gap-2">
            <div class="flex min-w-0 flex-col gap-1">
              <span class="font-medium text-sm text-gray-900 dark:text-white leading-snug">{{ task.title }}</span>
              <span class="text-xs font-medium text-gray-500 dark:text-gray-400">
                {{ t('task_level') }} {{ task.round }}
              </span>
            </div>
            <span
              role="checkbox"
              :aria-checked="isTaskDone(task)"
              :aria-label="t('task_completed')"
              class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-colors"
              :class="isTaskDone(task)
                ? 'border-green-500 bg-green-500 dark:border-green-400 dark:bg-green-400'
                : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-900'"
            >
              <UIcon v-if="isTaskDone(task)" name="i-lucide-check" class="h-3 w-3 text-white" />
            </span>
          </div>
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSystemsStore } from '~/stores/systemsStore'
import type { Task } from '~/model/Task/Task'
import { isTaskDone, isTaskLevelLocked } from '~/utils/taskLevels'
import { systemPageRouteFromPath, systemVisiblePages, taskAllowsPage } from '~/utils/taskPageVisibility'

const { t } = useI18n()

const systemsStore = useSystemsStore()
const globalSettings = useGlobalSettingsStore()
const route = useRoute()
const selectedTask = ref<Task | null>(null)
const currentRound = computed(() => systemsStore.selectedSystem?.currentRound ?? 1)
const { pushFirstAvailablePage } = useAvailableSystemPages()

const currentSystemPageRoute = computed(() => {
  const systemId = systemsStore.selectedSystemId

  if (!systemId) {
    return route.path
  }

  return systemPageRouteFromPath(route.path, systemId)
})
const currentSystemPage = computed(() =>
  systemsStore.selectedSystem
    ? systemVisiblePages(systemsStore.selectedSystem).find(page => page.route === currentSystemPageRoute.value) ?? null
    : null
)

const tasks = computed(() =>
  (systemsStore.selectedSystem?.tasks ?? []).filter(task => isTaskVisibleOnCurrentPage(task))
)

function isTaskVisibleOnCurrentPage(task: Task): boolean {
  if (!currentSystemPage.value) {
    return true
  }

  return taskAllowsPage(task, currentSystemPageRoute.value)
}

async function openTask(task: Task) {
  if (isTaskLocked(task)) {
    return
  }

  if (globalSettings.teacherMode) {
    globalSettings.selectedTaskId = task.id
    await pushFirstAvailablePage(task)
    return
  }

  globalSettings.selectedTaskId = task.id
  selectedTask.value = task
  await pushFirstAvailablePage(task)
}

function closeTask() {
  selectedTask.value = null
  globalSettings.selectedTaskId = null
}

function isTaskLocked(task: Task): boolean {
  return !globalSettings.teacherMode && isTaskLevelLocked(task, currentRound.value)
}
</script>
