<template>
    <div>
        <LocalNavbar />

        <div class="container mx-auto px-4 py-8">
                    <h1 class="text-4xl font-bold mb-4">{{ t('sessions') }}</h1>

            <div class="flex justify-end mb-6">
                <AddSessionButton />
            </div>

            <!-- Sessions Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="session in sessions" :key="session.id" class="session-card" v-provide="{ session }">

                    <!-- Session Header -->
                    <div class="session-header">
                        <!-- Session Capacity Status -->
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-xl font-semibold text-gray-900">
                                {{ t('session') }} {{ session.id }}
                            </h3>
                            <SessionStatusBadge :sessionId="session.id" />
                        </div>

                        <!-- Date Range + Day Count Badge -->
                        <div class="flex items-center gap-2 text-sm text-gray-600 mb-4">
                            <SessionDateRange :sessionId="session.id" />
                            <SessionDayCountBadge :sessionId="session.id" />
                        </div>

                        <!-- Capacity Progress -->
                        <SessionCapacitySection :sessionId="session.id" />

                        <!-- Participants Section -->
                        <!--<SessionParticipantsSection :sessionId="session.id" />-->

                        <SessionParticipantsCount :sessionId="session.id" />
                        <SessionParticipantsList :sessionId="session.id" />

                        <!-- Supervisors Section -->
                        <!--<SessionSupervisorsSection :sessionId="session.id" />-->
                        <SessionSupervisorsCount :sessionId="session.id" />
                        <SessionSupervisorsList :sessionId="session.id" />

                        <!-- Session Actions -->
                        <div class="session-actions mt-6 pt-4 border-t border-gray-200">
                            <div class="flex gap-2">
                                <!--
                                <div>
                                    <UButton size="sm" variant="outline" @click="viewSessionDetails(session)"
                                        class="flex-1" :id="'sessions-view-' + session.id">
                                        TO-DO
                                    </UButton>
                                </div>
                                <div>
                                    <UButton size="sm" color="primary" @click="manageSession(session)" class="flex-1"
                                        :id="'sessions-manage-' + session.id">
                                        TO-DO
                                    </UButton>
                                </div>
                                -->
                                <div>
                                    <button @click="editSession(session)"
                                        class="delete-button flex-1"
                                        :id="'sessions-edit-' + session.id">
                                        <span class="delete-icon">✏️</span>
                                        <span class="delete-text">{{ t('view_details') }}</span>
                                    </button>
                                </div>
                                <div class="flex-1">
                                    <SessionDeleteButton :sessionId="session.id" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="sessions.length === 0" class="empty-state">
                <UIcon name="i-heroicons-calendar-x-mark" class="empty-icon" />
                <h3 class="empty-title">{{ t('no_sessions') }}</h3>
                <p class="empty-description">{{ t('no_sessions_description') }}</p>
                <UButton @click="createNewSession" class="mt-4">
                    {{ t('create_session') }}
                </UButton>
            </div>
        </div>

        <!-- Edit Session Modal -->
        <EditSessionModal :session="selectedSessionForEdit" v-model="editModalOpen" />
    </div>
    <EditComponentModal v-if="highlightStore.isEditModeActive && highlightStore.selectedComponentId" />

</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSelectedSystemStore, useInformationSystemStore } from '#imports'
import { Session } from '~/model/Session'
import { Participant } from '~/model/Participant'
import { Supervisor } from '~/model/Supervisor'
import { useI18n } from 'vue-i18n'
import { useHighlightStore } from '#imports'
import { useHighlightWatchers } from '~/composables/highlightWatchers'
import SessionStatusBadge from '~/components/infsys_components/sessions/SessionStatusBadge.vue'
import SessionDateRange from '~/components/infsys_components/sessions/SessionDateRange.vue'
import SessionDayCountBadge from '~/components/infsys_components/sessions/SessionDayCountBadge.vue'
import SessionCapacitySection from '~/components/infsys_components/sessions/SessionCapacitySection.vue'
import SessionParticipantsSection from '~/components/infsys_components/sessions/SessionParticipantsSection.vue'
import SessionParticipantsList from '~/components/infsys_components/sessions/SessionParticipantsList.vue'
import SessionParticipantsCount from '~/components/infsys_components/sessions/SessionParticipantsCount.vue'
import SessionSupervisorsSection from '~/components/infsys_components/sessions/SessionSupervisorsSection.vue'
import SessionSupervisorsList from '~/components/infsys_components/sessions/SessionSupervisorsList.vue'
import SessionSupervisorsCount from '~/components/infsys_components/sessions/SessionSupervisorsCount.vue'   
import SessionDeleteButton from '~/components/infsys_components/sessions/SessionDeleteButton.vue'
import AddSessionButton from '~/components/infsys_components/sessions/AddSessionButton.vue'
import EditSessionModal from '~/components/infsys_components/sessions/EditSessionModal.vue'
import LocalNavbar from '~/components/LocalNavbar.vue'
import { InformationSystem } from '~/model/InformationSystem'
import { ComponentManager } from '#imports'

const route = useRoute()
const selectedSystemStore = useSelectedSystemStore()
const informationSystemStore = useInformationSystemStore()
const { t } = useI18n()
const highlightStore = useHighlightStore()

// Get system from route and set as selected
const systemId = route.params.id
const systems = informationSystemStore.systems
const system = computed(() => {
    return systems.find((sys: any) => sys.id === parseInt(systemId as string, 10)) || null
})

// Watch for system changes and set selected system
watch(system, (newSystem) => {
    if (newSystem) {
        selectedSystemStore.setSelectedSystem(newSystem as InformationSystem)
    }
}, { immediate: true })

// Watch for database initialization and initialize components when ready
watch(
    () => selectedSystemStore.selectedSystem?.dbInitialized && !ComponentManager.areComponentsInitialized(),
    (shouldInitialize) => {
        if (shouldInitialize && selectedSystemStore.selectedSystem?.db) {
            console.warn("[X] Components not initialized in sessions.vue")
            ComponentManager.initializeComponents()
        }
    },
    { immediate: true }
)

const localItems = ref([
    {
        label: t('dashboard'),
        icon: 'i-heroicons-chart-bar-20-solid',
        to: `/system/${systemId}/dashboard`,
        data_target: 'system-dashboard',
    },
    {
        label: t('sessions'),
        icon: 'i-heroicons-calendar-date-range',
        to: `/system/${systemId}/sessions`,
        data_target: 'system-sessions',
    },
    {
        label: t('participants'),
        to: `/system/${systemId}/participants`,
        data_target: 'system-participants',
    },
    {
        label: t('supervisors'),
        to: `/system/${systemId}/supervisors`,
        data_target: 'system-supervisors',
    },
    {
        label: t('database'),
        icon: 'i-heroicons-table-cells',
        to: `/system/${systemId}/database`,
        data_target: 'system-table',
    }
])
// Data from database
const sessions = computed(() => selectedSystemStore.sessions)
const supervisors = computed(() => selectedSystemStore.supervisors)
const showDetailModal = ref(false)
const selectedSession = ref<Session | null>(null)
const expandedParticipants = ref<Set<number>>(new Set())
const selectedSessionId = ref<number | null>(null)
const editModalOpen = ref(false)
const selectedSessionForEdit = ref<Session | null>(null)

useHighlightWatchers(highlightStore.highlightHandler, highlightStore);

// Watch for database availability and load sessions
watch(() => selectedSystemStore.selectedSystem?.db, (newDb) => {
    if (newDb) {
        selectedSystemStore.loadSessions()
    }
})

// Watch for system changes and load sessions
watch(() => selectedSystemStore.selectedSystem, (newSystem) => {
    if (newSystem?.db) {
        selectedSystemStore.loadSessions()
    }
})

// Load data from database
// Data is loaded in the store

// Helper functions
const getCapacityPercentage = (session: Session): number => {
    // Handle division by zero case
    if (session.capacity === 0) return 0
    return Math.round((session.participants.length / session.capacity) * 100)
}

const getCapacityColor = (session: Session): string => {
    const percentage = getCapacityPercentage(session)
    if (percentage >= 90) return '#ef4444' // red
    if (percentage >= 70) return '#f59e0b' // amber
    return '#10b981' // emerald
}

const getSessionStatus = (session: Session): string => {
    if (session.ifFull()) return t('full')
    const percentage = getCapacityPercentage(session)
    if (percentage >= 70) return t('almost_full')
    if (percentage > 0) return t('available')
    return t('empty')
}

const getSessionStatusColor = (session: Session): 'red' | 'yellow' | 'green' | 'neutral' => {
    if (session.ifFull()) return 'red'
    const percentage = getCapacityPercentage(session)
    if (percentage >= 70) return 'yellow'
    if (percentage > 0) return 'green'
    return 'neutral'
}

const formatDateRange = (fromDate: Date, toDate: Date): string => {
    const from = fromDate.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'short' })
    const to = toDate.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'short', year: 'numeric' })
    return `${from} - ${to}`
}

const getInitials = (name: string): string => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

const getSessionSupervisors = (sessionId: number): Supervisor[] => {
    const _supervisors = supervisors.value.filter(s => s.sessions.includes(sessionId));
    console.log("SUPERVISORS: ", _supervisors);
    return _supervisors
}

const viewSessionDetails = (session: Session) => {
    selectedSession.value = session
    showDetailModal.value = true
}

const manageSession = (session: Session) => {
    // Implementation for managing session
    console.log('Managing session:', session.id)
}

const editSession = (session: Session) => {
    console.log('Edit session clicked:', session)
    console.log('Available sessions:', selectedSystemStore.sessions)
    selectedSessionForEdit.value = session
    editModalOpen.value = true
    console.log('Modal should open now, selectedSessionForEdit:', selectedSessionForEdit.value)
}

const getDisplayedParticipants = (session: Session): Participant[] => {
    if (isParticipantsExpanded(session.id)) {
        return session.participants
    }
    return session.participants.slice(0, 3)
}

const isParticipantsExpanded = (sessionId: number): boolean => {
    return expandedParticipants.value.has(sessionId)
}

const toggleParticipantsExpanded = (sessionId: number) => {
    if (expandedParticipants.value.has(sessionId)) {
        expandedParticipants.value.delete(sessionId)
    } else {
        expandedParticipants.value.add(sessionId)
    }
}

const createNewSession = () => {
    // Implementation for creating new session
    console.log('Creating new session')
}
useHighlightWatchers(highlightStore.highlightHandler, highlightStore);

function getDayCount(session: Session): number {
    const start = session.fromDate
    const end = session.toDate
    const diff = end.getTime() - start.getTime()
    return Math.ceil(diff / (1000 * 3600 * 24)) + 1
}

// Sessions are loaded reactively via watchers above
// onMounted(() => {
//     // Ensure sessions are loaded when page mounts
//     if (selectedSystemStore.selectedSystem?.db) {
//         selectedSystemStore.loadSessions()
//     }
// })
</script>

<style scoped>
.session-card {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    border: 1px solid #e5e7eb;
    padding: 1.5rem;
    transition: box-shadow 0.3s ease;
}

.session-card:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.session-header {
    border-bottom: 1px solid #f3f4f6;
    padding-bottom: 1rem;
    margin-bottom: 1rem;
}

.session-actions {
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
}

.empty-state {
    text-align: center;
    padding: 3rem 0;
}

.empty-icon {
    width: 4rem;
    height: 4rem;
    margin: 0 auto 1rem;
    color: #9ca3af;
}

.empty-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.5rem;
}

.empty-description {
    color: #4b5563;
    max-width: 28rem;
    margin: 0 auto;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .session-card {
        padding: 1rem;
    }
}

.delete-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: #ffc919;
    color: white;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .delete-button:hover {
    background-color: #ecbc21;
  }

  .delete-icon {
    font-size: 1rem;
  }

  .delete-text {
    white-space: nowrap;
  }
</style>