<template>
  <nav class="navbar-container">
    <ul class="nav-list">
      <li v-for="item in items" :key="item.to">
        <NuxtLink :to="item.to" class="nav-link" :class="{ 'active': route.path === item.to }">
          <UIcon v-if="item.icon" :name="item.icon" class="nav-icon" />
          <span class="nav-label">{{ item.label }}</span>
        </NuxtLink>
      </li>
      <DebugButton />

    </ul>
  </nav>
</template>


<script setup lang="ts">
/* 1. Imports */
import { computed } from 'vue'
import { useRoute } from 'vue-router'

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
const items = computed(() => {
  // Access locale.value to make this computed reactive to locale changes
  void locale.value

  return [
    {
      label: t('home'),
      icon: 'i-heroicons-home',
      to: '/',
    },
    {
      label: t('systems'),
      icon: 'i-heroicons-computer-desktop',
      to: '/systems',
    },
    {
      label: t('settings'),
      icon: 'i-heroicons-cog',
      to: '/settings',
    },
    {
      label: t('teacher'),
      icon: 'i-heroicons-user-group',
      to: '/teacher',
    }
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

<style scoped>
.navbar-container {
  width: 100%;
  border-bottom: 2px solid #05df72;
  background-color: transparent;
  padding: 0.5rem;
  box-sizing: border-box;
}

.nav-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  list-style: none;
  padding: 0;
  margin: 0;
  justify-content: space-around;
  align-items: center;
  width: 100%;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  text-decoration: none;
  color: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.nav-link:hover {
  background-color: rgba(5, 223, 114, 0.1);
  color: #05df72;
}

.nav-link.active {
  background-color: rgba(5, 223, 114, 0.15);
  color: #05df72;
  box-shadow: inset 0 0 0 1px rgba(5, 223, 114, 0.2);
}

.nav-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Base styles: 0–359px (small phones) */
.nav-label {
  display: none;
}

@media (min-width: 360px) {
  .nav-label {
    display: inline;
  }

  .nav-list {
    justify-content: flex-start;
    gap: 0.5rem;
  }

  .nav-link {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }
}

@media (min-width: 768px) {
  .navbar-container {
    padding: 0.75rem 1.5rem;
  }

  .nav-list {
    gap: 1rem;
  }

  .nav-link {
    font-size: 1rem;
    padding: 0.6rem 1rem;
  }

  .nav-icon {
    width: 1.4rem;
    height: 1.4rem;
  }
}

@media (min-width: 1024px) {
  .navbar-container {
    padding: 1rem 2rem;
  }
}

@media (min-width: 1280px) {
  .nav-list {
    max-width: 1280px;
    margin: 0 auto;
  }
}
</style>
