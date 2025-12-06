<template>
  <div class="system-layout">
    <div class="main-content">
      <SystemNavbar class="system-navbar" />
      <div class="slot-content">
        <CustomScrollbar>
          <slot />
        </CustomScrollbar>
      </div>
      <ContextMenu class="context-menu" />
    </div>
    <div v-if="taskMenuStore.taskMenuDisplayedAsSidebar" class="content-placeholder">
      <TaskList class="task-list-sidebar" />
    </div>
  </div>
</template>

<script setup lang="ts">
const taskMenuStore = useTaskMenuStore()
</script>

<style scoped>
.system-layout {
  display: flex;
  flex-direction: row;
  height: 100vh;
}

.main-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100vh;
  width: 70vw;
}

.system-navbar {
  height: 6vh;
  flex-shrink: 0;
}

.slot-content {
  height: 85vh;
  overflow: hidden;
  flex-shrink: 0;
}

.context-menu {
  height: 6vh;
  flex-shrink: 0;
}

.content-placeholder {
  width: 30vw;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: sticky;
  top: 0;
  overflow-y: auto;
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
