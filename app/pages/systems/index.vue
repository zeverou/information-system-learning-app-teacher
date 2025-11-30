<script setup lang="ts">
/* 1. Imports */
import { onMounted, ref, computed } from 'vue'
import { navigateTo } from '#app'
import { FileHandler } from '~/composables/FileHandler'
import { InformationSystem } from '~/model/InformationSystem'
import { useInformationSystemStore } from '~/stores/useInformationSystemStore'
import { useSelectedSystemStore } from '~/stores/useSelectedSystemStore'
import JSZip from 'jszip'

/* 2. Stores */
const informationSystemStore = useInformationSystemStore()
const selectedSystemStore = useSelectedSystemStore()
/* 3. Context hooks */
const { t } = useI18n()
const toast = useToast()

/* 4. Constants (non-reactive) */
// Systems are now managed entirely through the store
//let systems: InformationSystem[] = FileHandler.getInformationSystems()
//let systems: InformationSystem[] = [];
/* 5. Props */
// none

/* 6. Emits */
// none

/* 7. Template refs */
// none

/* 8. Local state (ref, reactive) */
const isReloading = ref(false)
const value = ref(null)
const loadedSystemTitle = ref<string | null>(null)
const previewSystemName = ref<string | null>(null)
const open = ref(false)
const confirmClearOpen = ref(false)
const systemToDelete = ref<number | null>(null)
const isDuplicateId = ref(false)
const duplicateSystemId = ref<number | null>(null)

/* 9. Computed */
const flexJustifyClass = computed(() => informationSystemStore.systems.length === 1 ? 'justify-start' : 'justify-center')

/* 10. Methods */
function getCardBorderClass(index: number) {
  const colors = ['teacher', 'student', 'sky', 'violet', 'lime', 'green', 'yellow', 'red']
  const color = colors[index % colors.length]
  return `border-t-4 border-${color}-500`
}
watch(value, async (newZipFile) => {
  if (!newZipFile) {
    loadedSystemTitle.value = null
    previewSystemName.value = null
    isDuplicateId.value = false
    duplicateSystemId.value = null
    return
  }

  // Reset loaded state when new file is selected
  loadedSystemTitle.value = null
  isDuplicateId.value = false
  duplicateSystemId.value = null

  // Extract system name and id from ZIP file for preview
  try {
    const zip = await JSZip.loadAsync(newZipFile as File);
    const configEntry = Object.values(zip.files).find(file => file.name.endsWith('config.json'));

    if (configEntry) {
      const configText = await configEntry.async('text');
      const configData = JSON.parse(configText);
      previewSystemName.value = configData.name || 'Unknown System';
      const systemId = configData.id;
      if (systemId !== undefined) {
        isDuplicateId.value = informationSystemStore.systems.some(sys => sys.id === systemId);
        if (isDuplicateId.value) {
          duplicateSystemId.value = systemId;
        }
      }
    } else {
      previewSystemName.value = 'Invalid ZIP - no config.json found';
    }
  } catch (error) {
    console.error('Error reading ZIP file:', error);
    previewSystemName.value = 'Error reading ZIP file';
  }
})

watch(open, (newOpen) => {
  if (!newOpen) {
    value.value = null
    loadedSystemTitle.value = null
    previewSystemName.value = null
    isDuplicateId.value = false
    duplicateSystemId.value = null
  }
})

/* 11. Methods */
async function navigateToSystem(systemId: number) {
  selectedSystemStore.select(systemId)
  const selectedSystem = informationSystemStore.systems.find(sys => sys.id === systemId)
  if (selectedSystem) {
    // Ensure the system database is initialized before navigating
    if (!selectedSystem.dbInitialized) {
      // TODO: This is garbage
      try {
        console.log(`Initializing database for system ${systemId}...`)
        await informationSystemStore.initializeDbs()
      } catch (error) {
        console.error(`Error initializing database for system ${systemId}:`, error)
        // return
      }
    }

    // Re-find the system after potential initialization
    const currentSystem = informationSystemStore.systems.find(sys => sys.id === systemId)
    if (currentSystem && currentSystem.db) {
      selectedSystemStore.setSelectedSystem(currentSystem as InformationSystem)
    } else {
      console.warn(`System with ID ${systemId} could not be properly initialized.`)
      // return
    }
  } else {
    console.warn(`System with ID ${systemId} not found.`)
    // return
  }
  console.log("Navigating to system with ID:", systemId)
  navigateTo(`/systems/${systemId}/dashboard`)
}

function initializeSystems() {
  const systemsFromFile = FileHandler.getInformationSystems()
  console.log('Loaded systems from file:', systemsFromFile)

  try {
    // Merge file-based systems with any existing systems in the store
    // (persisted systems will already be in the store)
    const existingIds = new Set(informationSystemStore.systems.map(s => s.id))
    const newSystems = systemsFromFile.filter(s => !existingIds.has(s.id))
    informationSystemStore.systems.push(...newSystems)
  } catch (error) {
    console.error('Error setting systems in store:', error)
  }
}

function reloadSystems() {
  isReloading.value = true
  const systemsFromFile = FileHandler.getInformationSystems()
  informationSystemStore.systems = systemsFromFile
  isReloading.value = false
}

function confirmClearSystems() {
  confirmClearOpen.value = true
}

function clearSystemsConfirmed() {
  informationSystemStore.clearSystems()
  confirmClearOpen.value = false
  toast.add({
    title: t('systems_cleared'),
    description: t('all_systems_have_been_removed'),
    color: 'green'
  })
}

function deleteSystem(systemId: number) {
  systemToDelete.value = systemId
  // For now, directly delete without confirmation, but we could add a modal later
  informationSystemStore.deleteSystem(systemId)
  toast.add({
    title: t('system_deleted'),
    description: t('system_has_been_removed'),
    color: 'green'
  })
}

/* 12. Lifecycle */
onMounted(() => {
  //initializeSystems()
})

/* 13. defineExpose */
// none

function helper() {
  console.log("Systems in store:", informationSystemStore.systems)
}

async function uploadSystem() {
  if (!value.value) return

  try {
    const systemLoader = await SystemZipLoader.create(value.value as File);
    systemLoader.printFiles();
    const system: InformationSystem | null = await systemLoader.getSystem();
    if (system) {
      console.log('Loaded system from zip:', system)
      console.log('System name:', system.name)

      // Check if a system with the same ID already exists
      const existingSystem = informationSystemStore.systems.find(sys => sys.id === system.id)
      if (existingSystem) {
        toast.add({
          title: t('upload_error'),
          description: t('system_with_same_id_exists', { id: system.id }),
          color: 'red'
        })
        return
      }

      // Initialize the database for the uploaded system
      try {
        console.log('Initializing database for uploaded system...')
        system.db = await InformationSystem.databaseInitStatic(system.configData || system)
        system.dbInitialized = true
        console.log('Database initialized successfully')
      } catch (error) {
        console.error('Error initializing database for uploaded system:', error)
        toast.add({
          title: t('upload_error'),
          description: t('error_initializing_database'),
          color: 'red'
        })
        return
      }

      informationSystemStore.addSystem(system)
      loadedSystemTitle.value = system.name
      console.log('loadedSystemTitle set to:', loadedSystemTitle.value)

      // Close the modal after successful upload
      open.value = false

      // Reset the file input
      value.value = null

      previewSystemName.value = null

      // Show success toast
      toast.add({
        title: t('system_upload_success'),
        description: `${system.name} ${t('has_been_uploaded')}`,
        color: 'green'
      })
    } else {
      console.error('No valid system found in the uploaded zip file.')
      loadedSystemTitle.value = null

      // Show error toast for invalid system
      toast.add({
        title: t('upload_error'),
        description: t('no_valid_system_found'),
        color: 'red'
      })
    }
  } catch (error) {
    console.error('Error processing uploaded zip file:', error)
    loadedSystemTitle.value = null
    // Show error toast for processing error
    toast.add({
      title: t('upload_error'),
      description: t('error_processing_zip'),
      color: 'red'
    })
  }
}
</script>

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
              <p class="systems-page-description text-lg text-gray-600 dark:text-gray-300 max-w-prose leading-relaxed flex-1">
                {{ t('manage_your_systems_description') }}
              </p>

              <div class="flex flex-wrap gap-4">
                <UButton class="add-new-system-button" icon="i-lucide-plus-circle" size="lg" color="teacher" @click="open = true">
                  {{ t('add_new_system') }}
                </UButton>
                <UButton class="clear-all-systems-button" icon="i-lucide-trash-2" size="lg" color="red" variant="outline" @click="confirmClearSystems">
                  {{ t('clear_systems') }}
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Systems List -->
      <div v-if="informationSystemStore.systems.length > 0" class="space-y-6">
        <UCard v-for="(system, index) in informationSystemStore.systems" :key="system.id"
          class="group transition hover:ring-2 hover:ring-teacher-500/50 cursor-pointer shadow-lg dark:bg-gray-900/50"
          :class="getCardBorderClass(index)" @click="navigateToSystem(system.id)">
          <div class="space-y-4">
            <!-- System Header with Icon, Title, and Delete Button -->
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="p-2 bg-teacher-500/10 rounded-lg">
                  <UIcon name="i-heroicons-computer-desktop" class="w-6 h-6 text-teacher-500" />
                </div>
                <div>
                  <h3 class="system-name text-xl font-semibold text-gray-900 dark:text-white">{{ system.name }}</h3>
                  <p class="text-sm text-gray-500">{{ t('information_system') }}</p>
                </div>
              </div>
              <UButton icon="i-lucide-trash-2" color="red" variant="ghost" size="md"
                @click.stop="deleteSystem(system.id)" />
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

      <!-- Empty State -->
      <div v-else class="text-center py-16 space-y-6 max-h-[300px] flex flex-col justify-center">
        <div class="mx-auto w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
          <UIcon name="i-lucide-folder-x" class="w-12 h-12 text-gray-400 dark:text-gray-500" />
        </div>
        <div class="space-y-2">
          <h3 class="text-2xl font-semibold text-gray-900 dark:text-white">
            {{ t('no_systems_yet') }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            {{ t('no_systems_description') }}
          </p>
        </div>
      </div>

      <!-- Upload Modal -->
      <UModal class="system-zip-upload" v-model:open="open" :title="t('add_new_system')" close-icon="i-lucide-x">
        <template #body>
          <div class="space-y-6">
            <UFileUpload v-model="value" accept=".zip" :description="t('upload_system_zip')" class="w-full" />

            <div v-if="previewSystemName && !loadedSystemTitle"
              class="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <div class="flex items-center space-x-2">
                <UIcon name="i-lucide-check-circle" class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <p class="text-emerald-800 dark:text-emerald-200 font-medium">
                  {{ t('preview') }}: <span class="font-bold">{{ previewSystemName }}</span>
                </p>
              </div>
            </div>

            <UAlert v-if="isDuplicateId" color="red" variant="outline" icon="i-lucide-alert-triangle" :title="t('system_with_same_id_exists')">
            </UAlert>

            <UButton v-if="value && !loadedSystemTitle && !isDuplicateId" icon="i-lucide-upload" color="teacher" variant="solid"
              class="upload-system-button w-full" @click="uploadSystem">
              {{ t('upload_system') }}
            </UButton>
          </div>
        </template>
      </UModal>

      <!-- Clear Systems Confirmation Modal -->
      <UModal v-model:open="confirmClearOpen" :title="t('confirm_clear_systems')" close-icon="i-lucide-x">
        <template #body>
          <div class="space-y-6">
            <div class="text-center">
              <UIcon name="i-lucide-alert-triangle" class="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {{ t('are_you_sure') }}
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                {{ t('clear_systems_warning') }}
              </p>
            </div>

            <div class="flex gap-4">
              <UButton color="neutral" variant="outline" class="flex-1" @click="confirmClearOpen = false">
                {{ t('cancel') }}
              </UButton>
              <UButton color="red" variant="outline" class="flex-1" @click="clearSystemsConfirmed">
                {{ t('clear_all') }}
              </UButton>
            </div>
          </div>
        </template>
      </UModal>
    </div>
  </div>
</template>