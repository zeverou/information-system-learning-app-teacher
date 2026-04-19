<template>
  <div v-if="props.selectedTask" class="space-y-6 pt-2">
    <div class="grid gap-8 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] xl:items-start">
      <div class="space-y-4 rounded-xl border border-gray-200 p-4 dark:border-gray-800">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ t('task_detail_title') }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ t('task_detail_description') }}
            </p>
          </div>

          <UButton
            icon="i-lucide-download"
            color="neutral"
            variant="soft"
            size="sm"
            @click="downloadTaskJson"
          >
            {{ t('task_download_json') }}
          </UButton>
        </div>

        <UFormField :label="t('task_title_label')">
          <UInput v-model="taskForm.title" :placeholder="t('task_title_placeholder')" class="w-full" />
        </UFormField>

        <UFormField :label="t('task_description_label')">
          <UTextarea
            v-model="taskForm.description"
            :placeholder="t('task_description_placeholder')"
            :rows="4"
            autoresize
            class="w-full"
          />
        </UFormField>
      </div>

      <div class="space-y-4 rounded-xl border border-gray-200 p-4 dark:border-gray-800">
        <span class="text-sm font-semibold text-gray-900 dark:text-white md:col-span-2">
          {{ t('task_scoring_label') }}
        </span>

        <div class="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
          <UFormField>
            <template #label>
              <span>{{ t('task_round') }}</span>
              <span class="ml-1 font-normal text-gray-500 dark:text-gray-400">
                ({{ t('task_round_info') }})
              </span>
            </template>
            <UInput v-model.number="taskForm.round" type="number" min="1" class="w-full" />
          </UFormField>

          <UFormField>
            <template #label>
              <span>{{ t('task_points_reward') }}</span>
              <span class="ml-1 font-normal text-gray-500 dark:text-gray-400">
                ({{ t('task_points_reward_info') }})
              </span>
            </template>
            <UInput v-model.number="taskForm.pointsReward" type="number" min="0" class="w-full" />
          </UFormField>

          <UFormField>
            <template #label>
              <span>{{ t('task_fail_penalty') }}</span>
              <span class="ml-1 font-normal text-gray-500 dark:text-gray-400">
                ({{ t('task_fail_penalty_info') }})
              </span>
            </template>
            <UInput v-model.number="taskForm.failPenalty" type="number" min="0" class="w-full" />
          </UFormField>
        </div>
      </div>
    </div>

    <USeparator />

    <UFormField>
      <template #label>
        <span class="inline-flex items-center gap-1.5">
          {{ t('task_selected_components') }}
          <HoverHint :text="t('task_selected_components_info')">
            <button
              type="button"
              class="inline-flex h-4 w-4 items-center justify-center rounded-full text-gray-400 transition-colors hover:text-teacher-600 focus:outline-none dark:text-gray-500 dark:hover:text-teacher-400"
              :aria-label="t('task_selected_components_info')"
            >
              <UIcon name="i-lucide-info" class="h-4 w-4" />
            </button>
          </HoverHint>
        </span>
      </template>
      <div v-if="selectedComponentIds.length" class="flex flex-wrap gap-2">
        <UBadge v-for="componentId in selectedComponentIds" :key="componentId" color="neutral" variant="subtle"
          class="flex items-center gap-1 font-mono pr-1">
          <span>{{ componentId }}</span>
          <HoverHint :text="t('task_edit_component_action')">
            <UButton icon="i-lucide-pencil" color="neutral" variant="ghost" size="xs" class="shrink-0"
              @click.stop="startEditingComponent(componentId)" />
          </HoverHint>
          <HoverHint :text="t('task_remove_component_action')">
            <UButton icon="i-lucide-trash-2" color="red" variant="ghost" size="xs" class="shrink-0"
              @click.stop="removeSelectedComponent(componentId)" />
          </HoverHint>
        </UBadge>
      </div>
      <p v-else class="text-sm text-gray-500 dark:text-gray-400">
        {{ t('task_no_components') }}
      </p>
    </UFormField>

    <div v-if="editingComponent" class="space-y-4 rounded-xl border border-gray-200 p-4 dark:border-gray-800">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 class="text-base font-semibold text-gray-900 dark:text-white">
            {{ t('task_edit_component_title') }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ editingComponent.name || editingComponent.id }}
          </p>
        </div>

        <div class="flex items-center gap-2">
          <UButton color="neutral" variant="ghost" @click="stopEditingComponent">
            {{ t('task_close') }}
          </UButton>
          <UButton color="sky" :disabled="!isEditingComponentValid" @click="saveEditedComponent">
            {{ t('task_save_changes') }}
          </UButton>
        </div>
      </div>

      <EditComponentBody :key="editingComponent.id" ref="editComponentBodyRef" :component="editingComponent"
        @validation-change="isEditingComponentValid = $event" />
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
        <div class="space-y-4 rounded-xl border border-gray-200 p-4 dark:border-gray-800">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ t('task_activity') }}
          </h3>

          <div class="grid gap-4">
            <UFormField :label="t('task_activity_label_opt')">
              <UInput v-model="taskForm.activityLabel" :placeholder="t('task_activity_label_placeholder')" class="w-full" />
            </UFormField>

            <UFormField>
              <template #label>
                <span class="inline-flex items-center gap-1.5">
                  {{ t('task_activity_type') }}
                  <HoverHint>
                    <button
                      type="button"
                      class="inline-flex h-4 w-4 items-center justify-center rounded-full text-gray-400 transition-colors hover:text-teacher-600 focus:outline-none dark:text-gray-500 dark:hover:text-teacher-400"
                      :aria-label="t('task_activity_type_info')"
                    >
                      <UIcon name="i-lucide-info" class="h-4 w-4" />
                    </button>
                    <template #content>
                      <div class="space-y-1.5 text-left font-normal">
                        <p><span class="font-semibold">{{ t('task_activity_repair') }}</span>: {{ t('task_activity_repair_info') }}</p>
                        <p><span class="font-semibold">{{ t('task_activity_select') }}</span>: {{ t('task_activity_select_info') }}</p>
                        <p><span class="font-semibold">{{ t('task_activity_select_options') }}</span>: {{ t('task_activity_select_options_info') }}</p>
                      </div>
                    </template>
                  </HoverHint>
                </span>
              </template>
              <USelect v-model="taskForm.activityType" :items="activityTypeOptions" value-key="value" label-key="label"
                :placeholder="t('task_select_activity_type')" class="w-full" />
            </UFormField>

            <UFormField v-if="taskForm.activityType === ActivityType.SELECT_OPTIONS" :label="t('task_activity_options')">
              <div class="space-y-3">
                <div v-for="(option, index) in taskForm.activityOptions" :key="`activity-option-${index}`"
                  class="flex items-center gap-2 rounded-lg border border-gray-200 p-3 dark:border-gray-800">
                  <span class="w-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                    {{ index + 1 }}.
                  </span>
                  <UInput v-model="option.text" :placeholder="t('task_option_text_placeholder')" class="flex-1" />
                  <UButton :icon="option.isCorrect ? 'i-lucide-check' : 'i-lucide-x'"
                    :color="option.isCorrect ? 'green' : 'red'" variant="soft" size="sm" class="shrink-0"
                    @click="toggleActivityOptionCorrect(index)" />
                  <UButton icon="i-lucide-trash-2" color="red" variant="ghost" size="sm" class="shrink-0"
                    @click="removeActivityOption(index)" />
                </div>

                <UButton icon="i-lucide-plus" color="neutral" variant="soft" @click="addActivityOption">
                  {{ t('task_add_option') }}
                </UButton>
              </div>
            </UFormField>

            <UFormField :label="t('task_activity_description')">
              <UTextarea
                v-model="taskForm.activityDescription"
                :placeholder="t('task_activity_description_placeholder')"
                :rows="4"
                autoresize
                class="w-full"
              />
            </UFormField>

            <div class="flex items-start gap-2">
              <UCheckbox
                v-model="taskForm.substituteAfterActivity"
                :label="t('task_substitute_checkbox')"
              />
              <HoverHint :text="t('task_substitute_after_activity_hint')">
                <button
                  type="button"
                  class="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-gray-400 transition-colors hover:text-teacher-600 focus:outline-none dark:text-gray-500 dark:hover:text-teacher-400"
                  :aria-label="t('task_substitute_after_activity_hint')"
                >
                  <UIcon name="i-lucide-info" class="h-4 w-4" />
                </button>
              </HoverHint>
            </div>
          </div>
        </div>

        <div class="space-y-4 rounded-xl border border-gray-200 p-4 dark:border-gray-800">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ t('task_finish') }}
          </h3>

          <div class="grid gap-4">
            <UFormField :label="t('task_finish_label_opt')">
              <UInput v-model="taskForm.finishLabel" :placeholder="t('task_finish_label_placeholder')" class="w-full" />
            </UFormField>

            <UFormField :label="t('task_finish_description_label')">
              <UTextarea
                v-model="taskForm.finishDescription"
                :placeholder="t('task_finish_description_placeholder')"
                :rows="4"
                autoresize
                class="w-full"
              />
            </UFormField>

            <UFormField :label="t('task_finish_type')">
              <USelect v-model="taskForm.finishType" :items="finishTypeOptions" value-key="value" label-key="label"
                :placeholder="t('task_select_finish_type')" class="w-full" />
            </UFormField>

            <UFormField v-if="taskForm.finishType === FinishType.SELECT_OPTIONS" :label="t('task_finish_options')">
              <div class="space-y-3">
                <div v-for="(option, index) in taskForm.finishOptions" :key="`finish-option-${index}`"
                  class="flex items-center gap-2 rounded-lg border border-gray-200 p-3 dark:border-gray-800">
                  <span class="w-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                    {{ index + 1 }}.
                  </span>
                  <UInput v-model="option.text" :placeholder="t('task_option_text_placeholder')" class="flex-1" />
                  <UButton :icon="option.isCorrect ? 'i-lucide-check' : 'i-lucide-x'"
                    :color="option.isCorrect ? 'green' : 'red'" variant="soft" size="sm" class="shrink-0"
                    @click="toggleFinishOptionCorrect(index)" />
                  <UButton icon="i-lucide-trash-2" color="red" variant="ghost" size="sm" class="shrink-0"
                    @click="removeFinishOption(index)" />
                </div>

                <UButton icon="i-lucide-plus" color="neutral" variant="soft" @click="addFinishOption">
                  {{ t('task_add_option') }}
                </UButton>
              </div>
            </UFormField>

            <UFormField v-if="taskForm.finishType === FinishType.TYPE_CORRECT" :label="t('task_finish_correct_answer')">
              <UInput v-model="taskForm.finishCorrectAnswer" :placeholder="t('task_correct_answer_placeholder')" class="w-full" />
            </UFormField>
          </div>
        </div>
      </div>

      <div class="grid gap-4">
        <UFormField :label="t('task_feedback_label')" class="md:col-span-2">
          <UTextarea
            v-model="taskForm.feedback"
            :placeholder="t('task_feedback_placeholder')"
            :rows="4"
            autoresize
            class="w-full"
          />
        </UFormField>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import EditComponentBody from '~/components/EditComponentBody.vue'
import HoverHint from '~/components/HoverHint.vue'
import { Component as SystemComponent } from '~/model/Component'
import type { ComponentVariables } from '~/model/ComponentVariables'
import type { GUID } from '~/model/GUID'
import { ActivityType } from '~/model/Task/Activity/ActivityType'
import { FinishType } from '~/model/Task/Finish/FinishType'
import type { Task } from '~/model/Task/Task'
import { useSystemsStore } from '~/stores/systemsStore'

type TaskDetailForm = {
  id: GUID | ''
  title: string
  description: string
  finishDescription: string
  finishType: FinishType
  finishLabel: string
  round: number
  feedback: string
  pointsReward: number
  failPenalty: number
  activityType: ActivityType
  activityLabel: string
  activityDescription: string
  activityOptions: ActivityOption[]
  finishOptions: ActivityOption[]
  finishCorrectAnswer: string
  substituteAfterActivity: boolean
}

type ActivityOption = {
  text: string
  isCorrect: boolean
}

const props = defineProps<{
  selectedTask: Task | null
}>()
const globalSettings = useGlobalSettingsStore()
const systemsStore = useSystemsStore()
const selectedTaskFromSettings = computed<Task | null>(() => {
  if (!globalSettings.selectedTaskId) {
    return null
  }

  return systemsStore.selectedSystem?.tasks?.find(task => task.id === globalSettings.selectedTaskId) ?? props.selectedTask
})
const selectedComponentIds = computed(() =>
  selectedTaskFromSettings.value?.errorComponents?.map(component => component.id) ?? []
)
const editingComponentId = ref<string | null>(null)
const isEditingComponentValid = ref(true)
const editComponentBodyRef = ref<InstanceType<typeof EditComponentBody> | null>(null)
const editingComponent = ref<SystemComponent | null>(null)

defineModel<string>({ default: '' })

const emit = defineEmits<{
  (e: 'submit' | 'evaluate'): void
  (e: 'update:selectedTask', value: Task): void
}>()

const createDefaultForm = (): TaskDetailForm => ({
  id: '',
  title: '',
  description: '',
  finishDescription: '',
  finishType: FinishType.IMMEDIATE,
  finishLabel: '',
  round: 1,
  feedback: '',
  pointsReward: 0,
  failPenalty: 1,
  activityType: ActivityType.REPAIR,
  activityLabel: '',
  activityDescription: '',
  activityOptions: [],
  finishOptions: [],
  finishCorrectAnswer: '',
  substituteAfterActivity: false
})

const taskForm = reactive<TaskDetailForm>(createDefaultForm())

const { t } = useI18n()

const finishTypeOptions = computed(() => [
  { label: t('task_finish_type_after_activity'), value: FinishType.IMMEDIATE },
  { label: t('task_finish_type_after_db_label'), value: FinishType.AFTER_DATABASE_UPDATE },
  { label: t('task_finish_type_select_options_label'), value: FinishType.SELECT_OPTIONS },
  { label: t('task_finish_type_correct_label'), value: FinishType.TYPE_CORRECT }
])

const activityTypeOptions = computed(() => [
  { label: t('task_activity_repair'), value: ActivityType.REPAIR },
  { label: t('task_activity_select'), value: ActivityType.SELECT },
  { label: t('task_activity_select_options'), value: ActivityType.SELECT_OPTIONS }
])

watch(
  () => props.selectedTask,
  (task) => {
    Object.assign(taskForm, createDefaultForm())

    if (!task) {
      return
    }

    Object.assign(taskForm, {
      id: task.id,
      title: task.title,
      description: task.description,
      finishDescription: task.finishDescription,
      finishType: task.finishType,
      finishLabel: (task as Task & { finish?: { label?: string } }).finish?.label ?? '',
      round: task.round,
      feedback: task.feedback,
      pointsReward: task.pointsReward,
      failPenalty: task.failPenalty,
      activityType: task.activityType,
      activityLabel: task.activity?.label ?? '',
      activityDescription: task.activity?.description ?? '',
      activityOptions: Array.isArray((task.activity as { options?: ActivityOption[] } | undefined)?.options)
        ? (task.activity as { options?: ActivityOption[] }).options.map(option => ({
          text: option.text ?? '',
          isCorrect: Boolean(option.isCorrect)
        }))
        : [],
      finishOptions: Array.isArray(((task as Task & { finish?: { options?: ActivityOption[] } }).finish?.options))
        ? ((task as Task & { finish?: { options?: ActivityOption[] } }).finish?.options ?? []).map(option => ({
          text: option.text ?? '',
          isCorrect: Boolean(option.isCorrect)
        }))
        : [],
      finishCorrectAnswer: (task as Task & { finish?: { correctAnswer?: string } }).finish?.correctAnswer ?? '',
      substituteAfterActivity: (task.activity as any)?.substituteAfterActivity ?? false
    })
  },
  { immediate: true }
)

watch(
  taskForm,
  () => {
    if (!props.selectedTask) {
      return
    }

    emit('update:selectedTask', {
      ...props.selectedTask,
      ...taskForm,
      finishType: taskForm.finishType,
      finish: {
        ...((props.selectedTask as Task & { finish?: { label?: string } }).finish ?? {}),
        label: taskForm.finishLabel || undefined,
        description: taskForm.finishDescription || undefined,
        options: taskForm.finishType === FinishType.SELECT_OPTIONS
          ? taskForm.finishOptions.map(option => ({ ...option }))
          : undefined,
        correctAnswer: taskForm.finishType === FinishType.TYPE_CORRECT
          ? taskForm.finishCorrectAnswer
          : undefined
      },
      activityType: taskForm.activityType,
      activity: {
        ...(props.selectedTask.activity ?? {}),
        label: taskForm.activityLabel || undefined,
        description: taskForm.activityDescription || taskForm.description,
        activityComponents: props.selectedTask.activity?.activityComponents ?? props.selectedTask.errorComponents ?? [],
        substituteAfterActivity: taskForm.substituteAfterActivity,
        options: taskForm.activityType === ActivityType.SELECT_OPTIONS
          ? taskForm.activityOptions.map(option => ({ ...option }))
          : undefined
      }
    })
  },
  { deep: true }
)

watch(selectedComponentIds, (componentIds) => {
  if (editingComponentId.value && !componentIds.includes(editingComponentId.value)) {
    stopEditingComponent()
  }
})

watch(
  () => taskForm.finishType,
  (newType) => {
    if (newType === FinishType.IMMEDIATE && !taskForm.finishDescription) {
      taskForm.finishDescription = t('task_finish_immediate_default_description')
    }
  },
  { immediate: true }
)

function removeSelectedComponent(componentId: string) {
  const selectedTask = selectedTaskFromSettings.value

  if (!selectedTask?.errorComponents?.some(component => component.id === componentId)) {
    return
  }

  emit('update:selectedTask', {
    ...selectedTask,
    errorComponents: selectedTask.errorComponents.filter(component => component.id !== componentId),
    activity: {
      ...(selectedTask.activity ?? {}),
      activityComponents: (selectedTask.activity?.activityComponents ?? selectedTask.errorComponents).filter(
        component => component.id !== componentId
      )
    }
  })

  if (editingComponentId.value === componentId) {
    stopEditingComponent()
  }
}

function startEditingComponent(componentId: string) {
  editingComponentId.value = componentId
  const source = selectedTaskFromSettings.value?.errorComponents?.find(c => c.id === componentId)
  editingComponent.value = source ? SystemComponent.fromJSON(JSON.parse(JSON.stringify(source))) : null
}

function stopEditingComponent() {
  editingComponentId.value = null
  editingComponent.value = null
  isEditingComponentValid.value = true
}

async function saveEditedComponent() {
  if (!editComponentBodyRef.value || !editingComponent.value) {
    return
  }

  const payload = editComponentBodyRef.value.getDraftData() as {
    updatedComponent: SystemComponent
    updatedVariables: ComponentVariables
  }

  const updatedClone = SystemComponent.fromJSON(JSON.parse(JSON.stringify(editingComponent.value)))
  Object.assign(updatedClone, payload.updatedComponent)
  updatedClone.variables = payload.updatedVariables

  const task = selectedTaskFromSettings.value
  if (task?.errorComponents) {
    const idx = task.errorComponents.findIndex(c => c.id === editingComponentId.value)
    if (idx !== -1) {
      task.errorComponents[idx] = updatedClone
    }
    emit('update:selectedTask', { ...task, errorComponents: [...task.errorComponents] })
  }

  stopEditingComponent()
}

function downloadTaskJson() {
  const task = selectedTaskFromSettings.value ?? props.selectedTask
  if (!task) return
  const json = JSON.stringify(task, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `task-${task.id}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function addActivityOption() {
  taskForm.activityOptions.push({
    text: '',
    isCorrect: false
  })
}

function removeActivityOption(index: number) {
  taskForm.activityOptions.splice(index, 1)
}

function toggleActivityOptionCorrect(index: number) {
  const option = taskForm.activityOptions[index]

  if (!option) {
    return
  }

  option.isCorrect = !option.isCorrect
}

function addFinishOption() {
  taskForm.finishOptions.push({
    text: '',
    isCorrect: false
  })
}

function removeFinishOption(index: number) {
  taskForm.finishOptions.splice(index, 1)
}

function toggleFinishOptionCorrect(index: number) {
  const option = taskForm.finishOptions[index]

  if (!option) {
    return
  }

  option.isCorrect = !option.isCorrect
}
</script>
