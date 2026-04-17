<template>
  <div class="max-w-5xl mx-auto py-12 px-4 sm:px-6">
    <div class="grid grid-cols-1 gap-8">

      <!-- Header Section -->
      <UCard class="border-t-4 border-teacher-500 shadow-lg dark:bg-gray-900/50">
        <div class="flex flex-col md:flex-row items-start gap-6">
          <div class="hidden md:flex p-3 bg-teacher-500/10 rounded-lg text-teacher-500">
            <UIcon name="i-heroicons-cog-6-tooth" class="w-10 h-10" />
          </div>

          <div class="flex-1">
            <h1 class="settings-page-title text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {{ t('settings') }}
            </h1>
            <p class="settings-page-description text-lg text-gray-600 dark:text-gray-300 max-w-prose leading-relaxed">
              {{ t('settings_description') }}
            </p>
          </div>
        </div>
      </UCard>

      <!-- Language Settings -->
      <UCard class="border-t-4 border-sky-500 shadow-lg dark:bg-gray-900/50">
        <div class="space-y-4">
          <div class="flex items-center space-x-3 mb-6">
            <div class="p-2 bg-sky-500/10 rounded-lg">
              <UIcon name="i-heroicons-language" class="w-6 h-6 text-sky-500" />
            </div>
            <h2 class="language-settings-title text-xl font-semibold text-gray-900 dark:text-white">
              {{ t('language_settings') }}
            </h2>
          </div>

          <div class="space-y-2">
            <label for="locale-select" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ t('select_language') }}
            </label>
            <USelect :model-value="locale" @update:model-value="setLocale" color="sky" :items="localeOptions"
              class="settings-language-select w-full max-w-xs"/>
          </div>
        </div>
      </UCard>

      <!-- Appearance Settings -->
      <UCard class="border-t-4 border-orange-500 shadow-lg dark:bg-gray-900/50">
        <div class="space-y-4">
          <div class="flex items-center space-x-3 mb-6">
            <div class="p-2 bg-orange-500/10 rounded-lg">
              <UIcon name="i-heroicons-swatch" class="w-6 h-6 text-orange-500" />
            </div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ t('appearance_settings') }}
            </h2>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ t('task_menu_sidebar') }}</span>
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ t('task_menu_sidebar_description') }}</span>
            </div>
            <USwitch color="orange" :model-value="globalSettingsStore.taskMenuDisplayedAsSidebar" @update:model-value="val => globalSettingsStore.taskMenuDisplayedAsSidebar = val" />
          </div>
          <div class="flex items-center justify-between mt-4">
            <div class="flex flex-col">
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ t('load_systems_from_public_folder') }}</span>
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ t('load_systems_from_public_folder_description') }}</span>
            </div>
            <USwitch color="orange" :model-value="globalSettingsStore.loadSystemsFromPublicFolder" @update:model-value="val => globalSettingsStore.loadSystemsFromPublicFolder = val" />
          </div>
          <!-- Dark Mode Switch -->
          <div class="flex items-center justify-between mt-4">
            <div class="flex flex-col">
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ t('dark_mode') }}</span>
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ t('dark_mode_description') }}</span>
            </div>
            <UColorModeSwitch color="orange" />
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
/* 1. Imports */
import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'


/* 2. Stores */
const globalSettingsStore = useGlobalSettingsStore()

/* 3. Context hooks */
const { locale, availableLocales, setLocale, t } = useI18n()

/* 4. Constants (non-reactive) */
// none

/* 5. Props */
// none

/* 6. Emits */
// none

/* 7. Template refs */
// none

/* 8. Local state (ref, reactive) */
// none

/* 9. Computed */
const localeOptions = computed(() =>
  globalSettingsStore.languages.map(lang => ({ label: lang.name, value: lang.code }))
)

/* 10. Watchers */
// none

/* 11. Methods */
// none

/* 12. Lifecycle */
// none

/* 13. defineExpose */
// none
</script>
