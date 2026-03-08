<script setup lang="ts">
const route = useRoute()
const isSystemRoute = computed(() => /^\/systems\/[^/]+\//.test(route.path))
</script>

<template>
  <div class="default-layout flex flex-col overflow-hidden bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
    <SystemNavbar v-if="isSystemRoute" class="default-navbar" />
    <GlobalNavbar v-else class="default-navbar" />
    <main class="default-main">
      <CustomScrollbar>
        <slot />
      </CustomScrollbar>
    </main>
  </div>
</template>

<style scoped>
.default-layout {
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.default-navbar {
  flex-shrink: 0;
  width: 100%;
}

.default-main {
  flex: 1;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
}
</style>
