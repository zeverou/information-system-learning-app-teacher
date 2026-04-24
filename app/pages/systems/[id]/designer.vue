<template>
  <div class="min-h-screen bg-white dark:bg-gray-950">
    <div class="mx-auto w-[90vw] max-w-none p-6">
      <div class="mb-6 mt-5 flex items-center justify-between gap-4">
        <div class="min-w-0">
          <h1
            class="flex items-center gap-3 text-4xl font-extrabold tracking-tight text-teacher-600 dark:text-teacher-400 sm:text-5xl"
          >
            <span>{{ t("task_designer") }}</span>
          </h1>
        </div>

        <UButton
          icon="i-lucide-arrow-left"
          color="teacher"
          variant="outline"
          @click="goBackToSystem"
        >
          {{ t("go_back_to_system") }}
        </UButton>
      </div>

      <div class="mt-10 border-t border-gray-200 pt-8 dark:border-gray-800">
        <TasksDesignerPanel />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import TasksDesignerPanel from "~/components/TasksDesignerPanel.vue";
import { useSystemsStore } from "~/stores/systemsStore";

definePageMeta({
  middleware: ["teacher-designer"],
  fullscreenSystemPage: true,
});

const route = useRoute();
const router = useRouter();
const systemsStore = useSystemsStore();
const systemId = route.params.id as string;
const { t } = useI18n();

systemsStore.selectedSystemId = systemId;

const firstSystemRoute = computed(() => {
  const firstPageRoute = systemsStore.selectedSystem?.pages?.[0]?.route;
  return firstPageRoute
    ? `/systems/${systemId}${firstPageRoute}`
    : `/systems/${systemId}/dashboard`;
});
const backToRoute = computed(() => {
  const backTo = route.query.backTo;
  return typeof backTo === "string" && backTo.length > 0
    ? backTo
    : firstSystemRoute.value;
});

function goBackToSystem() {
  router.push(backToRoute.value);
}
</script>
