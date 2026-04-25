<template>
  <div class="flex flex-col gap-4">
    <UFormField>
      <template #label>
        <span>{{ t('task_level_count') }}</span>
        <span class="ml-1 font-normal text-gray-500 dark:text-gray-400">
          ({{ t('task_level_count_info') }})
        </span>
      </template>
      <UInput
        v-model.number="systemLevelCount"
        type="number"
        min="1"
        class="w-[8rem] max-w-full"
      />
    </UFormField>

    <div class="flex flex-wrap items-center gap-2">
      <!--
        <UButton
          icon="i-lucide-download"
          color="neutral"
          variant="soft"
          :disabled="!tasks.length"
          @click="exportAllTasks"
        >
          {{ t('task_export_all') }}
        </UButton>

        <UButton
          icon="i-lucide-upload"
          color="neutral"
          variant="soft"
          @click="showImportAllModal = true"
        >
          {{ t('task_import_all') }}
        </UButton>
      -->

        <ModernHoverPopover
          :title="previewStudentView ? t('task_preview_student_title') : t('task_preview_editor_title')"
          :description="previewStudentView ? t('task_preview_student_desc') : t('task_preview_editor_desc')"
          :icon="previewStudentView ? 'i-lucide-eye' : 'i-lucide-pencil'"
        >
          <UButton
            :icon="previewStudentView ? 'i-lucide-pencil' : 'i-lucide-eye'"
            color="neutral"
            :variant="previewStudentView ? 'solid' : 'soft'"
            @click="previewStudentView = !previewStudentView"
          >
            {{ previewStudentView ? t('task_editor_view') : t('task_student_preview') }}
          </UButton>
        </ModernHoverPopover>

        <UButton
          icon="i-lucide-plus"
          color="primary"
          variant="soft"
          @click="createTask"
        >
          {{ t('task_new_task') }}
        </UButton>
    </div>

    <UAlert
      v-if="inconsistentLevelVisiblePages.length"
      color="red"
      icon="i-lucide-alert-triangle"
      :title="t('task_level_visible_pages_mismatch_title')"
      :description="visiblePagesMismatchDescription"
    />

    <div class="flex flex-wrap gap-2">
      <UBadge
        v-for="task in tasks"
        :key="task.id"
        color="neutral"
        :variant="selectedTask?.id === task.id ? 'solid' : 'subtle'"
        class="flex items-center gap-2 px-3 py-1 transition"
        @click="selectedTask = task"
      >
        <span class="cursor-pointer">
          {{ task.title || t('task_untitled') }}
        </span>
        <HoverHint :text="t('task_remove_task_action')">
          <UButton
            icon="i-lucide-trash-2"
            color="red"
            variant="ghost"
            size="xs"
            class="shrink-0"
            @click.stop="deleteTask(task.id)"
          />
        </HoverHint>
      </UBadge>
      <UBadge
        as="button"
        color="neutral"
        variant="outline"
        class="flex cursor-pointer items-center gap-1.5 border-dashed px-3 py-1 transition hover:bg-gray-50 dark:hover:bg-gray-800"
        @click="showImportModal = true"
      >
        <UIcon name="i-lucide-file-json" class="h-3.5 w-3.5" />
        {{ t('task_add_from_json') }}
      </UBadge>
    </div>

    <TaskStudentDetail
      v-if="previewStudentView"
      :task="selectedTask"
    />
    <TaskDetail
      v-else
      :selected-task="selectedTask"
      @update:selected-task="handleTaskUpdate"
    />

    <UModal v-model:open="showImportModal" :title="t('task_import_title')" :ui="{ content: 'w-[560px]' }">
      <template #body>
        <div class="flex flex-col gap-4">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ t('task_import_description') }}
          </p>
          <UFileUpload
            v-model="importFile"
            accept=".json,application/json"
            icon="i-lucide-file-json"
            :label="t('task_upload_json')"
          />
          <UTextarea
            v-model="importJsonText"
            :placeholder='"{ \"id\": \"...\", \"title\": \"...\" }"'
            :rows="10"
            class="font-mono w-full"
          />
          <p v-if="importError" class="text-sm text-red-500">
            {{ importError }}
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="neutral" variant="ghost" @click="showImportModal = false">{{ t('cancel') }}</UButton>
          <UButton color="primary" @click="importFromJson">{{ t('task_import_btn') }}</UButton>
        </div>
      </template>
    </UModal>

    <UModal v-model:open="showImportAllModal" :title="t('task_import_all_title')" :ui="{ content: 'w-[560px]' }">
      <template #body>
        <div class="flex flex-col gap-4">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ t('task_import_all_description') }}
          </p>
          <UFileUpload
            v-model="importAllFile"
            accept=".json,application/json"
            icon="i-lucide-file-json"
            :label="t('task_upload_json')"
          />
          <UTextarea
            v-model="importAllJsonText"
            placeholder="[ { &quot;id&quot;: &quot;...&quot;, &quot;title&quot;: &quot;...&quot; }, ... ]"
            :rows="10"
            class="font-mono w-full"
          />
          <p v-if="importAllError" class="text-sm text-red-500">
            {{ importAllError }}
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="neutral" variant="ghost" @click="showImportAllModal = false">{{ t('cancel') }}</UButton>
          <UButton color="primary" @click="importAllFromJson">{{ t('task_import_all_btn') }}</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import HoverHint from '~/components/HoverHint.vue'
import ModernHoverPopover from '~/components/ModernHoverPopover.vue'
import type { GUID } from '~/model/GUID'
import type { InformationSystem } from '~/model/InformationSystem'
import { Task } from '~/model/Task/Task'
import { useSystemsStore } from '~/stores/systemsStore'
import { inconsistentVisiblePageLevels } from '~/utils/taskLevels'
import { systemVisiblePages } from '~/utils/taskPageVisibility'

const showImportModal = ref(false)
const importJsonText = ref('')
const importError = ref('')
const importFile = ref<File | null>(null)
const showImportAllModal = ref(false)
const importAllJsonText = ref('')
const importAllError = ref('')
const importAllFile = ref<File | null>(null)
const previewStudentView = ref(false)

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })
}

watch(importFile, async (file) => {
  if (!file) return
  importJsonText.value = await readFileAsText(file)
})

watch(importAllFile, async (file) => {
  if (!file) return
  importAllJsonText.value = await readFileAsText(file)
})

const { t } = useI18n()
const systemsStore = useSystemsStore()
const globalSettings = useGlobalSettingsStore()
const selectedTask = ref<Task | null>(null)
const systemLevelCount = ref(1)
const tasks = computed(() => systemsStore.selectedSystem?.tasks ?? [])
const inconsistentLevelVisiblePages = computed(() => {
  const system = systemsStore.selectedSystem
  return system ? inconsistentVisiblePageLevels(system.tasks, systemVisiblePages(system)) : []
})
const visiblePagesMismatchDescription = computed(() => {
  const levels = inconsistentLevelVisiblePages.value.join(', ')
  return levels
    ? `${t('task_level_visible_pages_mismatch_description')} ${t('task_levels')}: ${levels}`
    : t('task_level_visible_pages_mismatch_description')
})
let persistSystemTimeout: ReturnType<typeof setTimeout> | null = null

watch(selectedTask, (task) => {
  globalSettings.selectedTaskId = task?.id ?? null
  globalSettings.selectedComponents = new Set((task?.errorComponents ?? []).map(c => c.id))
})

watch(() => globalSettings.selectedTaskId, (id) => {
  if (selectedTask.value?.id === id) return
  selectedTask.value = tasks.value.find(t => t.id === id) ?? null
}, { immediate: true })

watch(
  () => systemsStore.selectedSystem?.levelCount,
  (levelCount) => {
    systemLevelCount.value = normalizeLevelCount(levelCount)
  },
  { immediate: true }
)

watch(systemLevelCount, (levelCount) => {
  handleLevelCountUpdate(levelCount)
})

const importFromJson = async () => {
  importError.value = ''
  let data: unknown
  try {
    data = JSON.parse(importJsonText.value)
  } catch {
    importError.value = t('task_import_error_json')
    return
  }

  const system = systemsStore.selectedSystem
  if (!system) {
    importError.value = t('task_import_error_no_system')
    return
  }

  const importedTask = Task.fromJSON(data)
  importedTask.id = crypto.randomUUID() as GUID

  system.tasks.push(importedTask)
  selectedTask.value = importedTask
  showImportModal.value = false
  importJsonText.value = ''
  importFile.value = null

  await persistSystemNow(system)
}

const importAllFromJson = async () => {
  importAllError.value = ''
  let data: unknown
  try {
    data = JSON.parse(importAllJsonText.value)
  } catch {
    importAllError.value = t('task_import_error_json')
    return
  }

  if (!Array.isArray(data)) {
    importAllError.value = t('task_import_all_error_array')
    return
  }

  const system = systemsStore.selectedSystem
  if (!system) {
    importAllError.value = t('task_import_error_no_system')
    return
  }

  system.tasks = data.map((item: unknown) => {
    const task = Task.fromJSON(item)
    task.id = crypto.randomUUID() as GUID
    return task
  })

  selectedTask.value = system.tasks[0] ?? null
  showImportAllModal.value = false
  importAllJsonText.value = ''
  importAllFile.value = null

  await persistSystemNow(system)
}

const exportAllTasks = () => {
  const data = JSON.stringify(tasks.value, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const systemName = systemsStore.selectedSystem?.name ?? 'tasks'
  a.download = `${systemName}-tasks.json`
  a.click()
  URL.revokeObjectURL(url)
}

const createTask = async () => {
  const system = systemsStore.selectedSystem
  if (!system) {
    return
  }

  const taskId = crypto.randomUUID() as GUID
  const newTask = new Task(taskId, 'New Task', '')

  system.tasks.push(newTask)
  selectedTask.value = newTask

  await persistSystemNow(system)
}

const handleTaskUpdate = (updatedTask: Task) => {
  const system = systemsStore.selectedSystem
  if (!system?.tasks) {
    return
  }

  const taskToUpdate = system.tasks.find(task => task.id === updatedTask.id)
  if (!taskToUpdate) {
    return
  }

  Object.assign(taskToUpdate, updatedTask)
  selectedTask.value = taskToUpdate

  queueSystemPersist(system)
}

const handleLevelCountUpdate = (levelCount: number) => {
  const system = systemsStore.selectedSystem
  if (!system) {
    return
  }

  const normalizedLevelCount = normalizeLevelCount(levelCount)
  if (system.levelCount === normalizedLevelCount) {
    return
  }

  system.levelCount = normalizedLevelCount
  system.currentRound = Math.min(system.currentRound, system.levelCount)
  system.tasks.forEach((task) => {
    task.round = Math.min(normalizeTaskLevel(task.round), system.levelCount)
  })

  queueSystemPersist(system)
}

const deleteTask = async (taskId: GUID) => {
  const system = systemsStore.selectedSystem
  if (!system?.tasks) {
    return
  }

  system.tasks = system.tasks.filter(task => task.id !== taskId)

  if (selectedTask.value?.id === taskId) {
    selectedTask.value = null
  }

  await persistSystemNow(system)
}

function refreshDefaultTasks(system: InformationSystem) {
  system.defaultTasks = system.tasks.map(task => Task.fromJSON(JSON.parse(JSON.stringify(task))))
}

function queueSystemPersist(system: InformationSystem) {
  if (persistSystemTimeout) {
    clearTimeout(persistSystemTimeout)
  }

  persistSystemTimeout = setTimeout(() => {
    persistSystemTimeout = null
    refreshDefaultTasks(system)
    void systemsStore.updateSystem(system)
  }, 1000)
}

async function persistSystemNow(system: InformationSystem) {
  if (persistSystemTimeout) {
    clearTimeout(persistSystemTimeout)
    persistSystemTimeout = null
  }

  refreshDefaultTasks(system)
  await systemsStore.updateSystem(system)
}

function normalizeLevelCount(value: unknown): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? Math.max(1, Math.floor(parsed)) : 1
}

function normalizeTaskLevel(value: unknown): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? Math.max(1, Math.floor(parsed)) : 1
}

onBeforeUnmount(() => {
  const system = systemsStore.selectedSystem
  if (!system || !persistSystemTimeout) {
    return
  }

  clearTimeout(persistSystemTimeout)
  persistSystemTimeout = null
  refreshDefaultTasks(system)
  void systemsStore.updateSystem(system)
})
</script>
