<template>
    <div class="max-w-5xl mx-auto py-12 px-4 sm:px-6">
        <div class="grid grid-cols-1 gap-8">
            <!-- Header Section -->
            <UCard class="border-t-4 border-teacher-500 shadow-lg dark:bg-gray-900/50">
                <div class="flex flex-col md:flex-row items-start gap-6">
                    <div class="hidden md:flex p-3 bg-teacher-500/10 rounded-lg text-teacher-500">
                        <UIcon name="i-heroicons-computer-desktop" class="w-10 h-10" />
                    </div>

                    <div class="flex-1">
                        <h1 class="systems-page-title text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {{ t('information_systems') }}
                        </h1>

                        <div class="flex flex-col lg:flex-row lg:items-center gap-6">
                            <p
                                class="systems-page-description text-lg text-gray-600 dark:text-gray-300 max-w-prose leading-relaxed flex-1">
                                {{ t('manage_your_systems_description') }}
                            </p>

                            <div class="flex flex-wrap gap-4">
                                <UploadSystemZipModal />
                                <UButton class="clear-all-systems-button" icon="i-lucide-trash-2" size="lg" color="red"
                                    variant="solid" @click="">
                                    {{ t('clear_systems') }}
                                </UButton>
                            </div>
                        </div>
                    </div>
                </div>
            </UCard>

            <!-- Systems List -->
            <div v-if="systemsStore.systems.length > 0" class="space-y-6">
                <UCard v-for="(system, index) in systemsStore.systems" :key="system.id"
                    class="group transition hover:ring-2 hover:ring-teacher-500/50 cursor-pointer shadow-lg dark:bg-gray-900/50"
                    @click="navigateToSystem(system.id)">
                    <div class="space-y-4">
                        <!-- System Header with Icon, Title, and Delete Button -->
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <div class="p-2 bg-teacher-500/10 rounded-lg">
                                    <UIcon name="i-heroicons-computer-desktop" class="w-6 h-6 text-teacher-500" />
                                </div>
                                <div>
                                    <h3 class="system-name text-xl font-semibold text-gray-900 dark:text-white">{{
                                        system.name }}</h3>
                                    <p class="text-sm text-gray-500">{{ t('information_system') }}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-3">
                                <UBadge :color="dbReadyMap[system.id] ? 'green' : 'red'" variant="subtle"
                                    :icon="dbReadyMap[system.id] ? 'i-lucide-database' : 'i-lucide-database'">
                                    {{ dbReadyMap[system.id] ? t('db_ready') : t('db_not_ready') }}
                                </UBadge>
                                <UButton icon="i-lucide-trash-2" color="red" variant="ghost" size="md"
                                    @click.stop="deleteSystem(system.id)" />
                            </div>
                        </div>

                        <!-- Description -->
                        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">{{ system.description }}</p>

                        <!-- Enter Button -->
                        <div class="pt-4">
                            <UButton icon="i-lucide-arrow-right" color="teacher" variant="outline" class="w-full"
                                @click.stop="navigateToSystem(system.id)">
                                {{ t('enter_system') }}
                            </UButton>
                        </div>
                    </div>
                </UCard>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
/* 1. Imports */
import { DatabaseWrapper } from '~/utils/DatabaseWrapper'

/* 2. Stores */
const globalSettingsStore = useGlobalSettingsStore()
const systemsStore = useSystemsStore()

/* 3. Context hooks */
const { t } = useI18n()
const toast = useToast()
const router = useRouter()

/* 4. State */
const dbReadyMap = reactive<Record<string, boolean>>({})

/* 5. Lifecycle */
onMounted(async () => {
    const result = await IndexedDbStorage.GetStoredInformationSystems()
    if (result.result === OperationResultType.SUCCESS && result.data) {
        systemsStore.systems.splice(0, systemsStore.systems.length, ...result.data)
        for (const sys of result.data) {
            dbReadyMap[sys.id] = await DatabaseWrapper.isDatabaseInitialized(sys.database)
        }
    }
})

/* 5. Methods */
async function navigateToSystem(id: string) {
    console.log("Navigating to system " + id)
    systemsStore.selectedSystemId = id

    const system = systemsStore.getSystemById(id)
    if (!system) {
        console.error("System not found for system " + id)
        return
    }


    if (!await DatabaseWrapper.isDatabaseInitialized(system.database)) {
        console.log("Initializing DB for system " + id)
        await system.database.initializeDatabase()
    }
    else {
        console.error("System or database not found for system " + id)
    }

    console.log("Navigating to dashboard...")
    router.push(`/systems/${id}/dashboard`)
}

async function deleteSystem(id: string) {
    await systemsStore.deleteSystemById(id)
}

</script>