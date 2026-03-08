<template>
    <div class="p-6 flex flex-col gap-8 max-w-7xl mx-auto">
        <div class="flex justify-between items-center mb-4">
            <h1 class="text-4xl font-bold">{{ t('sessions') }}</h1>
            <UButton color="primary" icon="i-heroicons-plus">{{ t('create_session') }}</UButton>
        </div>
        <!-- Sessions Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="sessionId in sessionIds" :key="sessionId"
                class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">

                <!-- Session Header -->
                <div class="border-b border-gray-100 pb-4 mb-4">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-xl font-semibold text-gray-900">
                            {{ t('session') }} {{ sessionId }}
                        </h3>
                        <ComponentWrapper :component="statusBadgeComponent" :generalVariables="{ sessionId: sessionId }" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-if="sessionIds.length === 0 && isDbReady" class="text-center py-12">
            <UIcon name="i-heroicons-calendar-x-mark" class="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ t('no_sessions') }}</h3>
            <p class="text-gray-600 mb-4">{{ t('no_sessions_description') }}</p>
            <UButton color="primary">{{ t('create_session') }}</UButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import ComponentWrapper from '~/components/ComponentWrapper.vue';
import { useSystemsStore } from '~/stores/systemsStore';
import { DatabaseHandler } from '~/utils/DatabaseHandler';

const route = useRoute();
const systemsStore = useSystemsStore();
const { t } = useI18n();
const systemId = route.params.id as string;

// Set current system ID
systemsStore.selectedSystemId = systemId;

// Top level stats
const sessionsCount = computed(() => systemsStore.getComponentById('stats-sessions'));
const supervisorsCount = computed(() => systemsStore.getComponentById('stats-supervisors'));
const participantsCount = computed(() => systemsStore.getComponentById('stats-participants'));

const sessionIds = ref<number[]>([]);
const isDbReady = computed(() => !!systemsStore.selectedSystem?.database?.sqlJsDatabase);

// The badge component is the same for every card; sessionId is injected via generalVariables
const statusBadgeComponent = computed(() => systemsStore.getComponentById('session-status-badge-genvar'));

// Fetch session IDs
const loadSessions = async () => {
    const db = systemsStore.selectedSystem?.database?.sqlJsDatabase;
    if (!db) return;

    try {
        const result = await DatabaseHandler.query(db, "SELECT id_turnusu FROM turnusy ORDER BY id_turnusu");
        if (result.data && result.data[0] && result.data[0].values) {
            sessionIds.value = result.data[0].values.map(row => Number(row[0]));
        }
    } catch (e) {
        console.error("Failed to load sessions:", e);
    }
};

watch(() => systemsStore.selectedSystem?.database?.sqlJsDatabase, (newDb) => {
    if (newDb) {
        loadSessions();
    }
}, { immediate: true });

onMounted(() => {
    if (systemsStore.selectedSystem?.database?.sqlJsDatabase) {
        loadSessions();
    }
});
</script>

<style scoped>
/* Scoped styles can stay clean, ComponentWrapper manages its own CSS */
</style>