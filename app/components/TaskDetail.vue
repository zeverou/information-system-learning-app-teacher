<template>
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
                    <svg v-if="selectedTask.componentsRepaired" class="w-4 h-4 text-white" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
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

        <div>
            <!-- Input for type-correct tasks -->
            <div v-if="selectedTask.activityType === ActivityType.TYPE_CORRECT">
                <UInput v-model="answer" placeholder="Enter your answer" class="mt-2 mb-4" />
            </div>

            <!-- Button container with flex layout -->
            <div class="flex items-center gap-2">
                <!-- Type of task: select -->
                <template v-if="selectedTask.activityType === ActivityType.SELECT && !selectedTask.completed">
                    <UButton variant="outline" color="lime"
                        :disabled="selectedTask.completed || selectedTask.componentsRepaired || !highlightStore.selectedIds || highlightStore.selectedIds.size === 0"
                        @click="$emit('submit')">
                        {{ t('submit') }}
                    </UButton>

                    <UButton variant="outline" color="lime"
                        :disabled="selectedTask.completed || selectedTask.componentsRepaired || !highlightStore.selectedIds || highlightStore.selectedIds.size === 0"
                        @click="$emit('evaluate')">
                        {{ t('check_repair_task') }}
                    </UButton>
                </template>

                <!-- Type of task: type-correct -->
                <template v-if="selectedTask.activityType === ActivityType.TYPE_CORRECT && !selectedTask.completed">
                    <UButton variant="outline" :disabled="selectedTask.completed" color="lime" @click="$emit('submit')">
                        {{ t('submit') }}
                    </UButton>
                </template>

                <!-- Type of task: repair -->
                <template v-if="selectedTask.activityType === ActivityType.REPAIR && !selectedTask.completed">
                    <UButton color="lime"
                        :disabled="selectedTask.completed || selectedTask.componentsRepaired || !highlightStore.selectedIds || highlightStore.selectedIds.size === 0"
                        variant="outline" @click="$emit('submit')">
                        {{ t('check_repair_task') }}
                    </UButton>
                </template>

                <!-- Button for repaired components -->
                <template v-if="selectedTask.componentsRepaired && !selectedTask.completed">
                    <UButton type="submit" color="lime"
                        :disabled="selectedTask.completed || selectedTask.componentsRepaired || !highlightStore.selectedIds || highlightStore.selectedIds.size === 0"
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
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ActivityType } from '~/model/Task/ActivityType'
import type { Task } from '~/model/Task'
import { useHighlightStore } from '#imports'

const props = defineProps<{
    selectedTask: Task
    modelValue: string
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
    (e: 'submit'): void
    (e: 'evaluate'): void
}>()

const { t } = useI18n()
const highlightStore = useHighlightStore()

const answer = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})
</script>
