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
            <USelect
              v-model="locale"
              :items="localeOptions"
              class="settings-language-select w-full max-w-xs"
              @update:model-value="onLocaleChange"
            />
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
             <USwitch 
                :model-value="taskMenuStore.taskMenuDisplayedAsSidebar" 
                @update:model-value="taskMenuStore.toggleTaskMenuDisplay" 
             />
          </div>
        </div>
      </UCard>

      <!-- Keyboard Shortcuts -->
      <UCard class="border-t-4 border-violet-500 shadow-lg dark:bg-gray-900/50">
        <div class="space-y-4">
          <div class="flex items-center space-x-3 mb-6">
            <div class="p-2 bg-violet-500/10 rounded-lg">
              <UIcon name="i-heroicons-command-line" class="w-6 h-6 text-violet-500" />
            </div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ t('keyboard_shortcuts') }}
            </h2>
          </div>

          <div class="grid gap-4">
            <div
              v-for="[action, shortcut] in settingsStore.shortcuts"
              :key="action"
              class="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <span class="text-base font-medium text-gray-900 dark:text-white">{{ t(action) }}</span>
              <UKbd size="lg" variant="solid" class="bg-teacher-500 border-teacher-500 text-white">
                {{ shortcut }}
              </UKbd>
            </div>
          </div>
        </div>
      </UCard>

    </div>
  </div>
</template>

<script setup lang="ts">
/* 1. Imports */
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { useSettingsStore, useTaskMenuStore } from "#imports"

/* 2. Stores */
const settingsStore = useSettingsStore()
const taskMenuStore = useTaskMenuStore()

/* 3. Context hooks */
const { locale, availableLocales, setLocale } = useI18n()

/* 4. Constants (non-reactive) */
const { t } = useI18n()

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
  availableLocales.map(locale => ({
    value: locale,
    label: locale === 'cs' ? 'Čeština' : 'English',
    icon: locale === 'cs' ? 'i-flag-cz-4x3' : 'i-flag-us-4x3'
  }))
)

const shortcutRows = computed(() => {
  // Defensive: fallback if shortcuts is not set
  if (!settingsStore.shortcuts || !(settingsStore.shortcuts instanceof Map)) return []
  return Array.from(settingsStore.shortcuts.entries()).map(([action, shortcut]) => ({
    action,
    shortcut
  }))
})

const shortcutColumns = [
  { id: 'action', label: 'Action / Akce' },
  { id: 'shortcut', label: 'Shortcut / Zkratka' }
]

/* 10. Watchers */
// none

/* 11. Methods */
function onLocaleChange(newLocale: 'cs' | 'en') {
  setLocale(newLocale)
}

/* 12. Lifecycle */
// none

/* 13. defineExpose */
// none
</script>
