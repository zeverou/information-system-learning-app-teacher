<template>
    <div class="max-w-5xl mx-auto py-12 px-4 sm:px-6">
        <div class="grid grid-cols-1 gap-8">
            <UCard class="border-t-4 border-teacher-500 shadow-lg dark:bg-gray-900/50">
                <div class="flex flex-col md:flex-row items-start gap-6">
                    <div class="hidden md:flex p-3 bg-teacher-500/10 rounded-lg text-teacher-500">
                        <UIcon name="i-lucide-graduation-cap" class="w-10 h-10" />
                    </div>
                    <div class="flex-1">
                        <h1 class="systems-page-title text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {{ t('teacher_page') }}
                        </h1>

                        <div class="flex flex-col lg:flex-row lg:items-center gap-6">
                            <p
                                class="systems-page-description text-lg text-gray-600 dark:text-gray-300 max-w-prose leading-relaxed flex-1">
                                {{ t('teacher_page_description') }}
                            </p>

                            <div class="flex flex-wrap gap-4">
                                <UButton @click="navigateTo('./teacher/tasks')" class="create-tasks-button" icon="i-lucide-trash-2" size="lg" color="teacher"
                                    variant="solid">
                                    {{ t('create_tasks') }}
                                </UButton>
                            </div>
                        </div>
                    </div>
                </div>
            </UCard>
        </div>
    </div>
</template>

<script setup lang="ts">

const systemsStore = useSystemsStore();
const { t } = useI18n()
const toast = useToast();

</script>
