<template>
    <div class="max-w-5xl mx-auto py-12 px-4 sm:px-6">
        <div class="grid grid-cols-1 gap-8">
            <UCard class="border-t-4 border-teacher-500 shadow-lg dark:bg-gray-900/50">
                <div class="flex flex-col md:flex-row items-start gap-6">
                    <div class="hidden md:flex p-3 bg-teacher-500/10 rounded-lg text-teacher-500">
                        <UIcon name="i-lucide-list-todo" class="w-10 h-10" />
                    </div>
                    <div class="flex-1">
                        <h1 class="systems-page-title text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {{ t('task_creation') }}
                        </h1>

                        <div class="flex flex-col lg:flex-row lg:items-center gap-6">
                            <p
                                class="systems-page-description text-lg text-gray-600 dark:text-gray-300 max-w-prose leading-relaxed flex-1">
                                {{ t('task_creation_description') }}
                            </p>
                        </div>
                    </div>
                </div>
            </UCard>

            <UCard class="border-t-4 border-sky-500 shadow-lg dark:bg-gray-900/50">
                <div class="space-y-4">
                    <div class="flex items-center space-x-3 mb-6">
                        <h2 class="language-settings-title text-xl font-semibold text-gray-900 dark:text-white">
                            {{ t('how_to_create_tasks') }}
                        </h2>
                    </div>

                    <div class="space-y-2">
                        <p class="text-gray-600 dark:text-gray-300">
                            {{ t('task_creation_step_1') }}
                        </p>
                        <p class="text-gray-600 dark:text-gray-300">
                            {{ t('task_creation_step_2') }}
                        </p>
                        <p class="text-gray-600 dark:text-gray-300">
                            {{ t('task_creation_step_3') }}
                        </p>
                    </div>
                </div>
            </UCard>

            <UButton @click="navigateTo('./tasks/designer')" class="go-to-designer-button w-full relative" icon="i-lucide-pencil-ruler" size="xl" color="teacher" variant="subtle">
                {{ t('go_to_designer') }}
                <UIcon name="i-lucide-arrow-right" class="absolute right-4 top-1/2 -translate-y-1/2" />
            </UButton>

        </div>
    </div>
</template>

<script setup lang="ts">

const systemsStore = useSystemsStore();
const { t } = useI18n()
const toast = useToast();

</script>
