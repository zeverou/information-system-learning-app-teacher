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
        @click="selectedTask = null"
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

      <button
        v-for="task in tasks"
        :key="task.id"
        class="flex flex-col gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 p-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/60 cursor-pointer w-full"
        @click="openTask(task)"
      >
        <div class="flex items-start justify-between gap-2">
          <span class="font-medium text-sm text-gray-900 dark:text-white leading-snug">{{ task.title }}</span>
          <UBadge :color="statusColor(task.status)" variant="subtle" size="xs" class="shrink-0 mt-0.5">
            {{ statusLabel(task.status) }}
          </UBadge>
        </div>
        <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span>{{ t('task_round') }} {{ task.round }}</span>
          <span>·</span>
          <span>{{ task.pointsReward }} {{ t('task_pts') }}</span>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSystemsStore } from '~/stores/systemsStore'
import { TaskStatus } from '~/model/Task/TaskStatus'
import type { Task } from '~/model/Task/Task'

const { t } = useI18n()

const systemsStore = useSystemsStore()
const globalSettings = useGlobalSettingsStore()
const selectedTask = ref<Task | null>(null)

const tasks = computed(() => systemsStore.selectedSystem?.tasks ?? [])

function statusColor(status: TaskStatus): 'green' | 'sky' | 'neutral' {
  switch (status) {
    case TaskStatus.COMPLETED: return 'green'
    case TaskStatus.IN_PROGRESS: return 'sky'
    default: return 'neutral'
  }
}

function statusLabel(status: TaskStatus): string {
  switch (status) {
    case TaskStatus.COMPLETED: return t('task_completed')
    case TaskStatus.IN_PROGRESS: return t('task_in_progress')
    default: return t('task_not_started')
  }
}

function openTask(task: Task) {
  if (globalSettings.teacherMode) {
    globalSettings.selectedTaskId = task.id
    return
  }

  selectedTask.value = task
}
</script>
