<template>
  <div class="flex items-center w-full justify-between text-lg py-4 px-4 text-black"
    style="border-bottom: 1px; border-color: #05df72; border-bottom-style: solid;">
    <!-- Navigation Menu on the left/center -->
    <UNavigationMenu :items="items" class="global-nav-menu flex-grow justify-start" style="z-index: 10000;" />
  </div>
</template>


<script setup lang="ts">
/* 1. Imports */
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { NavigationMenuItem } from '@nuxt/ui'

/* 2. Stores */
// none

/* 3. Context hooks */
const route = useRoute()
const { t, locale } = useI18n()

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
const items = computed<NavigationMenuItem[]>(() => {
  // Access locale.value to make this computed reactive to locale changes
  void locale.value

  return [
  {
    label: t('home'),
    icon: 'i-heroicons-home',
    to: '/',
    data_target: 'home',
  },
  {
    label: t('systems'),
    icon: 'i-heroicons-computer-desktop',
    to: '/systems',
    data_target: 'systems',
  },
  {
    label: t('settings'),
    icon: 'i-heroicons-cog',
    to: '/settings',
    data_target: 'settings',
  },

  ]
})

const isOnSystemDetailPage = computed(() => {
  return route.path.startsWith('/systems/') && route.params.id
})

/* 10. Watchers */
// none

/* 11. Methods */
// none

/* 12. Lifecycle */
// none

/* 13. defineExpose */
// none
</script>
