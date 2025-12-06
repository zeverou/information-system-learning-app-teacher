<template>
  <!-- Collapsed sidebar view -->
  <div 
    v-if="taskMenuStore.taskMenuDisplayedAsSidebar && taskMenuStore.sidebarCollapsed" 
    class="collapsed-sidebar"
    @click="taskMenuStore.toggleSidebarCollapsed"
  >
    <UIcon name="i-heroicons-chevron-left" class="w-6 h-6 text-gray-400" />
  </div>

  <!-- Full task list view -->
  <div v-else class="max-w-md mx-auto mt-8">
    <UCard class="bg-slate-950">

      <template #header>
        <div class="flex items-center justify-between">
          <!-- Empty left space to balance the layout -->
          <div class="w-20"></div>
          <!-- Centered Tasks title -->
          <h2 class="text-3xl font-semibold text-center flex-1 mt-4">{{ t('tasks') }}</h2>
          <!-- Collapse button when displayed as sidebar -->
          <UButton 
            v-if="taskMenuStore.taskMenuDisplayedAsSidebar" 
            class="mt-4" 
            color="neutral" 
            variant="ghost"
            icon="i-heroicons-chevron-right" 
            size="md"
            @click="taskMenuStore.toggleSidebarCollapsed"
          />
          <!-- Back button on the right -->
          <UButton v-else-if="selectedTask" class="mt-4" color="lime" @click="selectTask(selectedTask.id)" icon="i-heroicons-arrow-left" size="md">
            {{ t('back_to_tasks') }}
          </UButton>
          <!-- Empty space when no back button to keep title centered -->
          <div v-else class="w-20"></div>
        </div>
      </template>

      <!-- Green animation overlay -->
      <transition name="task-completed-fade">
        <div v-if="taskCompleted" class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div class="task-completed-animation"></div>
        </div>
      </transition>

      <!-- Red animation overlay for incorrect answers -->
      <transition name="task-incorrect-fade">
        <div v-if="taskIncorrect" class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div class="task-incorrect-animation"></div>
        </div>
      </transition>

      <!-- Task Details -->
      <div v-if="selectedTask">
        <div class="p-4">
          <div class="flex items-center mb-2">
            <UCheckbox color="lime" :model-value="selectedTask.completed" disabled class="mr-2 mb-1" />
            <h3 class="text-2xl font-bold mb-1">{{ selectedTask.title }}</h3>
          </div>
          <p class="mb-2 text-lg">{{ selectedTask.description }}</p>

          <!-- Custom Progress Steps -->
          <div class="flex items-center justify-between mb-8 mt-8">
            <!-- Step 1: Task Selected -->
            <div class="flex flex-col items-center">
              <div class="w-8 h-8 rounded-full flex items-center justify-center mb-2"
                style="background-color: #9ae600;">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <span class="text-sm text-center font-medium" style="color: #9ae600;">{{ t('task_selected') }}</span>
            </div>

            <!-- Connector Line -->
            <div class="flex-1 h-0.5 mx-2"
              :style="selectedTask.componentsRepaired ? 'background-color: #9ae600;' : 'background-color: #d1d5db;'">
            </div>

            <!-- Step 2: Components Repaired -->
            <div class="flex flex-col items-center">
              <div class="w-8 h-8 rounded-full flex items-center justify-center mb-2"
                :style="selectedTask.componentsRepaired ? 'background-color: #9ae600;' : 'background-color: #d1d5db;'">
                <svg v-if="selectedTask.componentsRepaired" class="w-4 h-4 text-white" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span v-else class="w-3 h-3 bg-white rounded-full"></span>
              </div>
              <span class="text-sm text-center font-medium"
                :style="selectedTask.componentsRepaired ? 'color: #9ae600;' : 'color: #6b7280;'">
                {{ t('components_repaired') }}
              </span>
            </div>

            <!-- Connector Line -->
            <div class="flex-1 h-0.5 mx-2"
              :style="selectedTask.completed ? 'background-color: #9ae600;' : 'background-color: #d1d5db;'"></div>

            <!-- Step 3: Task Completed -->
            <div class="flex flex-col items-center">
              <div class="w-8 h-8 rounded-full flex items-center justify-center mb-2"
                :style="selectedTask.completed ? 'background-color: #9ae600;' : 'background-color: #d1d5db;'">
                <svg v-if="selectedTask.completed" class="w-4 h-4 text-white" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span v-else class="w-3 h-3 bg-white rounded-full"></span>
              </div>
              <span class="text-sm text-center font-medium"
                :style="selectedTask.completed ? 'color: #9ae600;' : 'color: #6b7280;'">
                {{ t('task_completed') }}
              </span>
            </div>
          </div>

          <!--
          <span class="font-semibold">Kind of task: </span>
          <span>{{ selectedTask.kind }}</span><br>
-->
          <div>
            <!-- Input for type-correct tasks -->
            <div v-if="selectedTask.kind === 'type-correct'">
              <UInput v-model="form.answer" placeholder="Enter your answer" class="mt-2 mb-4" />
            </div>

            <!-- TODO 1.1: Questions form for repaired components -->
             <!--
            <div class="mb-4">
              <UForm :state="questionsForm">
                <div v-for="(question, idx) in questions" :key="idx" class="mb-2 flex items-center gap-2">
                  <UCheckbox color="lime" v-model="questionsForm[idx]" />
                  <label class="text-base">{{ question }}</label>
                </div>
              </UForm>
            </div>
            -->

            <!-- Button container with flex layout -->
            <div class="flex items-center gap-2">
              <!-- Kind of task: select -->
              <template v-if="selectedTask.kind === 'select' && !selectedTask.completed">
                <UButton variant="outline" color="lime"
                  :disabled="selectedTask.completed || selectedTask.componentsRepaired || !highlightStore.selectedIds || highlightStore.selectedIds.length === 0"
                  @click="handleSubmit">
                  {{ t('submit') }}
                </UButton>

                <UButton v-if="selectedTask.answer !== 'none'" variant="outline" color="lime"
                  :disabled="!selectedTask.componentsRepaired" @click="evaluate()">
                  {{ t('check_repair_task') }}
                </UButton>
              </template>

              <!-- Kind of task: type-correct -->
              <template v-if="selectedTask.kind === 'type-correct' && !selectedTask.completed">
                <UButton variant="outline" :disabled="selectedTask.completed" color="lime"
                  @click="handleSubmit">
                  {{ t('submit') }}
                </UButton>
              </template>

              <!-- Kind of task: repair -->
              <template v-if="selectedTask.kind === 'repair' && !selectedTask.completed">
                <UButton color="lime"
                  :disabled="selectedTask.completed || selectedTask.componentsRepaired || !highlightStore.selectedIds || highlightStore.selectedIds.length === 0"
                  variant="outline" @click="handleSubmit">
                  {{ t('check_repair_task') }}
                </UButton>
              </template>

              <!-- Button for repaired components -->
              <template v-if="selectedTask.componentsRepaired && !selectedTask.completed">
                <UButton type="submit" color="lime"
                  :disabled="selectedTask.completed || selectedTask.componentsRepaired || !highlightStore.selectedIds || highlightStore.selectedIds.length === 0"
                  variant="outline">
                  {{ t('check_repair_task') }}
                </UButton>
              </template>
            </div>
          </div>
          <div v-if="selectedTask.completed">
            <USeparator color="lime" class="mt-8 mb-6" />
            <h3 class="text-2xl font-semibold mb-2">{{ t('feedback') }}</h3>

            <p class="text-lg"> {{ selectedTask.feedback }}</p>
          </div>
        </div>
      </div>

      <div v-else>
        <div v-if="tasks.length === 0" class="text-center text-gray-500 py-4 text-lg">
          No tasks yet
        </div>
        <div v-else class="space-y-2">
          <div v-for="(task, index) in tasks" :key="index" class="flex items-center gap-3 p-3 rounded-lg">
            <UCheckbox color="lime" :model-value="task.completed" disabled class="mr-2" />
            <UCard class="flex-1">
              <div class="flex items-center justify-between">
                <span class="text-lg font-medium">{{ task.title }}</span>
                <UButton style="margin-left: 10px;" color="lime" size="sm" @click="selectTask(task.id)">{{ t('select_task') }}</UButton>
              </div>
            </UCard>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
/* 1. Imports */
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useSelectedSystemStore } from '~/stores/useSelectedSystemStore'
import { useInformationSystemStore } from '~/stores/useInformationSystemStore'
import { useSelectedTaskStore } from '~/stores/useSelectedTaskStore'
import { useSelectedComponentStore } from '~/stores/useSelectedComponentStore'
import { ComponentHandler, TaskAnswerEval, TaskQueue, useScoreStore } from '#imports'
import { useErrorComponentStore } from '#imports'
import { useHighlightStore } from '#imports'
import { Task } from '~/model/Task'
import { sys } from 'typescript'
import type { StepperItem } from '@nuxt/ui'
import { useComponentCodeStore } from '#imports'

/* 2. Stores */
const selectedSystemStore = useSelectedSystemStore()
const store = useInformationSystemStore()
const selectedTaskStore = useSelectedTaskStore()
const selectedComponentStore = useSelectedComponentStore()
const scoreStore = useScoreStore()
const errorComponentStore = useErrorComponentStore()
const highlightStore = useHighlightStore()
const componentCodeStore = useComponentCodeStore()
const taskMenuStore = useTaskMenuStore()

/* 3. Context hooks */
const { t } = useI18n()

/* 4. Constants (non-reactive) */
const systemId = selectedSystemStore.selectedId
const system = store.systems.find(sys => sys.id === systemId)
const toast = useToast()
// TODO: locale

/* 5. Props */
/* No props defined */

/* 6. Emits */
/* No emits defined */

/* 7. Template refs */
/* No template refs defined */

/* 8. State (ref, reactive) */
const currentStepIndex = ref(0)
const newTaskText = ref('')
const form = ref({
  answer: ''
})
const taskCompleted = ref(false)
const taskIncorrect = ref(false)
const questionsForm = ref<string[]>([])

/* 9. Computed */
/**
 * Computed property that returns the list of tasks for the current system.
 * Also manages highlight edit mode based on editable tasks.
 */
const tasks = computed(() => {
  if (systemId == null) return [];
  ComponentHandler.getComponentMap(selectedTaskStore.currentRound)

  const _tasks = TaskQueue.getTasks(systemId);

  // look at completed:false tasks with isEditable:true are  and if there is some print 1
  const editableTasks = _tasks.filter(task => !task.completed && task.isEditable);
  if (editableTasks.length > 0) {
    highlightStore.isEditModeActive = true;
  } else {
    highlightStore.isEditModeActive = false;
  }

  return _tasks;
})

/**
 * Computed property that returns the currently selected task.
 */
const selectedTask = computed(() =>
  tasks.value.find((t: Task) => t.id === selectedTaskStore.selectedId) ?? null
)

/**
 * Computed property that returns the questions for the selected task.
 */
const questions = computed(() => {
  if (!selectedTask.value) return []
  return TaskAnswerEval.getQuestions(selectedTask.value.answer)
})

/* 10. Watchers */
/**
 * Watcher for current round changes to show toast notifications.
 */
watch(() => selectedTaskStore.currentRound, (newRound) => {
  const newTasksCount = ComponentHandler.getComponentMap(newRound).length - selectedTaskStore.completedTasksCount;

  // někdy blbnou počty --> zobrazí se záporné číslo
  if (newTasksCount !== 0) {
    toast.add({
      title: t('new_tasks_added', { count: newTasksCount }),
      color: 'primary',
      icon: 'i-lucide-circle-check'
    })

  } else {
    // TODO: trochu zabugované ještě, někdy se zobrazlo jen po dokončení roundu
    toast.add({
      title: t('all_tasks_completed'),
      color: 'sky',
      icon: 'i-lucide-circle-check'
    })
  }

})

/**
 * Watcher for selected task changes to update step index.
 */
watch(selectedTask, (task) => {
  if (task?.completed) {
    currentStepIndex.value = 2
  }
})

/* 11. Methods */
/**
 * Handles the repair action for a task.
 * @param event - The mouse event
 */
async function handleRepair(event: MouseEvent) {
  // print selected task answer
  const evalResult: boolean = await TaskAnswerEval.evaluateTaskAnswer(selectedTask.value?.answer || '')
  console.log("Task answer evaluation result:", evalResult)
}

/**
 * Removes a task from the system.
 * @param index - The index of the task to remove
 */
function removeTask(index: number) {
  if (!system || !system.tasks) return
  system.tasks.splice(index, 1)
}

/**
 * Updates a task in the system.
 * @param index - The index of the task to update
 * @param task - The updated task object
 */
function updateTask(index: number, task: Task) {
  if (!system) return
}

/**
 * Selects or deselects a task.
 * @param id - The ID of the task to select
 */
function selectTask(id: number) {
  if (selectedTaskStore.selectedId === id) {
    selectedTaskStore.clear()
    selectedTaskStore.clearSelectedTask()
  } else {
    selectedTaskStore.select(id)

    // set selected Task using filter
    const currentTask: Task | undefined = tasks.value.find(t => t.id === id)
    console.log("CURRENT TASK:", currentTask)

    selectedTaskStore.setSelectedTask(currentTask || null)
    if (currentTask) {
      selectedTaskStore.setCurrentRound(currentTask.round)
    }


    console.log("Selected task:", selectedTaskStore.selectedTask)
    const selectedTaskId = selectedTaskStore.selectedId;
    const systemId = selectedSystemStore.selectedId;
    if (selectedTaskId !== null && systemId !== null) {
      const componentsToFind: string[] = TaskQueue.getSelectedTaskErrorComponentFilenames(selectedTaskId, systemId);
      selectedTaskStore.setSelectedTaskComponentsToFind(componentsToFind);
    }
    console.log("Selected task:", selectedTaskStore.selectedTask)
  }
}

/**
 * Handles the step change in the stepper.
 * @param newIndex - The new step index
 */
function onStepChange(newIndex: string | number | undefined) {
  if (typeof newIndex === 'number') {
    currentStepIndex.value = newIndex
    // Note: stepperItems is not defined in this component
    console.log('Current stepper index:', newIndex)
  }
}

/**
 * Handles the submission of a task answer.
 */
async function handleSubmit() {
  if (!selectedTask.value) return

  const selectedComponentId = selectedComponentStore.selectedId
  const errorComponents = selectedTask.value.errorComponents || []
  const expectedIds = errorComponents.map(comp => comp.id)
  const expected = new Set(expectedIds)
  let isMatch: boolean = false

  console.log("Error Components:", selectedTask.value.errorComponents)

  if (selectedTask.value.kind === 'select') {
    const actual: Set<string> = highlightStore.selectedIds
    let match: boolean = false;
    console.log("EXPECTED:", expected)
    console.log("ACTUAL:", actual)

    if ((actual.size === 0 && expected.size === 0) || (actual.size !== expected.size)) {
      match = false;
      console.log("Mismatch in size or empty selection")
    } else {
      match = true;
      for (const id of actual) {
        if (!expected.has(id)) {
          match = false;
          break;
        }
      }

    }
    console.log("FINISHED COMPONENTS:", errorComponentStore.errorComponents)

    isMatch = match
    if (isMatch) {
      await evaluate();
    }
  } else if (selectedTask.value.kind === 'type-correct') {
    const expected = selectedTask.value.answer.trim()
    const actual = form.value.answer.trim()
    isMatch = expected === actual
    console.log("Expected:", expected)
    console.log("Actual:", actual)
    console.log("Task kind: type-correct, isMatch:", isMatch)
  } else if (selectedTask.value.kind === 'repair') {
    isMatch = await TaskAnswerEval.evaluateTaskAnswer(selectedTask.value?.answer || '')
    if (system && selectedTask.value) {
      const idx = system.tasks.findIndex(t => t.id === selectedTask.value!.id)
      system.tasks[idx].completed = isMatch
      if (isMatch) {
        await evaluate();
      }
    }
  } else if (selectedTask.value.kind === 'select-options') {
    if (isMatch) {
      await evaluate();
    }
  }


  if (!isMatch) {
    taskIncorrect.value = true
    setTimeout(() => {
      taskIncorrect.value = false
    }, 1200)
    scoreStore.incrementWrongAnswers()
    console.log("Wrong answers count:", scoreStore.wrongAnswers)
    scoreStore.addUserRecord({
      taskId: selectedTask.value.id,
      answer: form.value.answer,
      isCorrect: false,
      timestamp: new Date()
    })
  }

  for (const id of selectedTaskStore.selectedTask?.errorComponents?.map(c => c.id) || []) {
    console.log("|X| REMOVING ERROR COMPONENT ID:", id)
    errorComponentStore.removeErrorComponent(id)
  }

  scoreStore.updateScore()
  console.log("Current score:", scoreStore.score)
  console.log("User records:", scoreStore.getUserRecords())
}

/**
 * Evaluates the task and updates its completion status.
 */
async function evaluate() {
  if (!system || !selectedTask.value) return

  const idx = system.tasks.findIndex(t => t.id === selectedTask.value!.id)
  if (idx !== -1) {
    console.log(selectedSystemStore.selectedSystem)

    system.tasks[idx].componentsRepaired = true

    highlightStore.isHighlightMode = false
    highlightStore.highlightHandler.clearSelection()

    if (selectedTaskStore.selectedTask?.answer === "none" || system.tasks[idx].completed) {
      system.tasks[idx].completed = true
      
      // Clean up error components and reset component code when task is completed
      if (selectedTask.value.kind === 'select' && highlightStore.selectedIds) {
        for (let id of highlightStore.selectedIds) {
          errorComponentStore.removeErrorComponent(id)

          const toRepair: string[] = ["sql", "html", "js"]

          for (const section of toRepair) {
            componentCodeStore.resetComponent(id)
          }
        }
      }
      
      taskCompleted.value = true
      setTimeout(() => {
        taskCompleted.value = false
      }, 1200)
      scoreStore.incrementCorrectAnswers()
      selectedTaskStore.completedTasksCount += 1;
      scoreStore.addUserRecord({
        taskId: selectedTask.value.id,
        answer: form.value.answer,
        isCorrect: true,
        timestamp: new Date()
      })
    } else {
      console.log("Evaluating task answer:", selectedTask.value.answer)
      const response = await TaskAnswerEval.evaluateTaskAnswer(selectedTask.value?.answer || '')
      console.log("Task answer evaluation result:", response)
      if (response) {
        system.tasks[idx].completed = true
        
        // Clean up error components and reset component code when task is completed
        if (selectedTask.value.kind === 'select' && highlightStore.selectedIds) {
          for (let id of highlightStore.selectedIds) {
            errorComponentStore.removeErrorComponent(id)

            const toRepair: string[] = ["sql", "html", "js"]

            for (const section of toRepair) {
              componentCodeStore.resetComponent(id)
            }
          }
        }
        
        taskCompleted.value = true
        setTimeout(() => {
          taskCompleted.value = false
        }, 1200)
        scoreStore.incrementCorrectAnswers()
        selectedTaskStore.completedTasksCount += 1;
        scoreStore.addUserRecord({
          taskId: selectedTask.value.id,
          answer: form.value.answer,
          isCorrect: true,
          timestamp: new Date()
        })
      }
    }

    // TODO: increment row after all tasks with current row are finished
    if (TaskQueue.getTasks(selectedTaskStore.currentRound).every(t => t.completed)) {
      selectedTaskStore.currentRound += 1
    }
  }

}

/* 12. Lifecycle */
/**
 * Lifecycle hook that sets up keyboard shortcuts and cleanup.
 */
onMounted(() => {
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 's' && event.altKey && selectedTask.value && !selectedTask.value.completed) {
      handleSubmit()
    }
  }

  document.addEventListener('keydown', handleKeydown)

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
})

/* 13. defineExpose */
/* No exposed methods */
</script>

<style scoped>
.task-completed-animation {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: rgba(34, 197, 94, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pop-fade 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  box-shadow: 0 0 40px 10px rgba(34, 197, 94, 0.5);
  position: relative;
}

.task-completed-animation::before {
  content: '';
  position: absolute;
  width: 60px;
  height: 30px;
  border: 6px solid white;
  border-top: none;
  border-right: none;
  transform: rotate(-45deg);
  animation: draw-checkmark 0.4s ease-out 0.3s forwards;
  opacity: 0;
}

.task-completed-animation::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(34, 197, 94, 0.3);
  animation: ripple-effect 1.2s ease-out forwards;
  z-index: -1;
}

.task-incorrect-animation {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pop-fade 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  box-shadow: 0 0 40px 10px rgba(239, 68, 68, 0.5);
  position: relative;
}

.task-incorrect-animation::before {
  content: '';
  position: absolute;
  width: 60px;
  height: 6px;
  background: white;
  border-radius: 3px;
  transform: rotate(45deg);
  animation: draw-cross-line1 0.4s ease-out 0.3s forwards;
  opacity: 0;
}

.task-incorrect-animation::after {
  content: '';
  position: absolute;
  width: 60px;
  height: 6px;
  background: white;
  border-radius: 3px;
  transform: rotate(-45deg);
  animation: draw-cross-line2 0.4s ease-out 0.3s forwards;
  opacity: 0;
}

@keyframes pop-fade {
  0% {
    transform: scale(0.5);
    opacity: 0.7;
  }

  60% {
    transform: scale(1.2);
    opacity: 1;
  }

  100% {
    transform: scale(1);
    opacity: 0;
  }
}

@keyframes draw-checkmark {
  0% {
    opacity: 0;
    transform: rotate(-45deg) scale(0.5);
  }

  100% {
    opacity: 1;
    transform: rotate(-45deg) scale(1);
  }
}

@keyframes ripple-effect {
  0% {
    transform: scale(1);
    opacity: 0.6;
  }

  100% {
    transform: scale(2);
    opacity: 0;
  }
}

@keyframes draw-cross-line1 {
  0% {
    opacity: 0;
    transform: rotate(45deg) scale(0.5);
  }

  100% {
    opacity: 1;
    transform: rotate(45deg) scale(1);
  }
}

@keyframes draw-cross-line2 {
  0% {
    opacity: 0;
    transform: rotate(-45deg) scale(0.5);
  }

  100% {
    opacity: 1;
    transform: rotate(-45deg) scale(1);
  }
}

.task-completed-fade-enter-active,
.task-completed-fade-leave-active {
  transition: opacity 0.3s;
}

.task-completed-fade-enter-from,
.task-completed-fade-leave-to {
  opacity: 0;
}

.collapsed-sidebar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #0f172a;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.collapsed-sidebar:hover {
  background-color: #1e293b;
}

.collapsed-sidebar:hover .w-6 {
  color: #9ae600;
}

.task-completed-fade-enter-to,
.task-completed-fade-leave-from {
  opacity: 1;
}

.task-incorrect-fade-enter-active,
.task-incorrect-fade-leave-active {
  transition: opacity 0.3s;
}

.task-incorrect-fade-enter-from,
.task-incorrect-fade-leave-to {
  opacity: 0;
}

.task-incorrect-fade-enter-to,
.task-incorrect-fade-leave-from {
  opacity: 1;
}
</style>