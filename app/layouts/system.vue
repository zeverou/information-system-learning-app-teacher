<template>
  <div class="system-layout">
    <SystemNavbar class="system-navbar" />
    <div class="layout-body">
      <div class="main-content"
        :class="{ 'main-content-expanded': taskMenuStore.taskMenuDisplayedAsSidebar && taskMenuStore.sidebarCollapsed }">
        <div class="slot-content">
          <CustomScrollbar>
            <slot />
          </CustomScrollbar>
        </div>
      </div>
      <div v-if="taskMenuStore.taskMenuDisplayedAsSidebar" class="content-placeholder"
        :class="{ 'content-placeholder-collapsed': taskMenuStore.sidebarCollapsed }">
        <TaskList class="task-list-sidebar" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const taskMenuStore = useTaskMenuStore()
</script>

<style scoped>
.system-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.layout-body {
  display: flex;
  flex-direction: row;
  flex: 1;
  overflow: hidden;
}

.main-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  transition: width 0.3s ease;
}

.system-navbar {
  flex-shrink: 0;
  width: 100%;
}

.slot-content {
  flex: 1;
  overflow: hidden;
}

.content-placeholder {
  width: 30vw;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  border-left: 1px solid #e5e7eb;
  transition: width 0.3s ease;
}

.dark .content-placeholder {
  border-left: 1px solid #1f2937;
}

.content-placeholder-collapsed {
  width: 48px;
}

.task-list-sidebar {
  width: 100% !important;
  max-width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  flex: 1;
}

.task-list-sidebar :deep(> div) {
  max-width: 100% !important;
  margin: 0 !important;
  height: 100% !important;
}

.task-list-sidebar :deep(.max-w-md) {
  max-width: 100% !important;
  margin: 0 !important;
  height: 100% !important;
}

.task-list-sidebar :deep(.mt-8) {
  margin-top: 0 !important;
}

.task-list-sidebar :deep([class*="UCard"]),
.task-list-sidebar :deep(.bg-slate-950) {
  height: 100% !important;
  border: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
}
</style>
