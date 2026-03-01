<template>
    <div v-if="selectedSessionInfo" class="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
        <UIcon name="i-heroicons-user-group" class="w-4 h-4 text-gray-600" />
        <div v-if="value === 'all'" class="highlightable" :id="'supervisors-capacity-count'"
            @click="highlightStore.isHighlightMode && highlightStore.highlightHandler.selectElement('supervisors-capacity-count', $event)">
            <div class="component-wrapper">
                <span class="text-sm font-medium text-gray-700">
                    {{ t('supervisors') }}: {{ selectedSessionInfo.currentCount }}
                </span>
                <EditComponentModalOpenButton v-if="highlightStore.isEditModeActive"
                    :componentId="'supervisors-capacity-count'" class="edit-button" />
            </div>
        </div>
        <div v-else class="highlightable" :id="'supervisors-capacity-count-session'"
            @click="highlightStore.isHighlightMode && highlightStore.highlightHandler.selectElement('supervisors-capacity-count-session', $event)">
            <div class="component-wrapper">
                <span class="text-sm font-medium text-gray-700">
                    {{ t('supervisors') }}: {{ selectedSessionInfo.currentCount }}
                </span>
                <EditComponentModalOpenButton v-if="highlightStore.isEditModeActive"
                    :componentId="'supervisors-capacity-count-session'" class="edit-button" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSelectedSystemStore } from '#imports'
import { useHighlightStore } from '#imports'
import { useComponentCodeStore } from '~/stores/useComponentCodeStore'
import { ComponentHandler } from '~/composables/ComponentHandler'

const { t } = useI18n()
const highlightStore = useHighlightStore()
const componentCodeStore = useComponentCodeStore()
const selectedSystemStore = useSelectedSystemStore()

const value = defineModel<string>({ default: 'all' })

const participantsCapacityCountComponent = computed(() => componentCodeStore.getComponentById('supervisors-capacity-count') || componentCodeStore.getDefaultComponent('supervisors-capacity-count'))
const participantsCapacityCountSessionComponent = computed(() => componentCodeStore.getComponentById('supervisors-capacity-count-session') || componentCodeStore.getDefaultComponent('supervisors-capacity-count-session'))

const correctParticipantsCapacityCountSqlTotalAll = computed(() => participantsCapacityCountComponent.value?.sql?.['sql-total-all'] || '')
const correctParticipantsCapacityCountSqlCurrentAll = computed(() => participantsCapacityCountComponent.value?.sql?.['sql-current-all'] || '')

const correctParticipantsCapacityCountSqlTotalSession = computed(() => participantsCapacityCountSessionComponent.value?.sql?.['sql-total-session'] || '')
const correctParticipantsCapacityCountSqlCurrentSession = computed(() => participantsCapacityCountSessionComponent.value?.sql?.['sql-current-session'] || '')

const participantsCapacityCountSqlTotal = computed(() => {
    if (value.value === 'all') {
        return ComponentHandler.getComponentValue('supervisors-capacity-count', 'sql-total-all', correctParticipantsCapacityCountSqlTotalAll.value)
    } else {
        return ComponentHandler.getComponentValue('supervisors-capacity-count-session', 'sql-total-session', correctParticipantsCapacityCountSqlTotalSession.value)
    }
})

const participantsCapacityCountSqlCurrent = computed(() => {
    if (value.value === 'all') {
        return ComponentHandler.getComponentValue('supervisors-capacity-count', 'sql-current-all', correctParticipantsCapacityCountSqlCurrentAll.value)
    } else {
        return ComponentHandler.getComponentValue('supervisors-capacity-count-session', 'sql-current-session', correctParticipantsCapacityCountSqlCurrentSession.value)
    }
})

const totalCapacity = computed(() => {
    const _ = selectedSystemStore.dbNumber
    if (!selectedSystemStore.selectedSystem?.db || typeof selectedSystemStore.selectedSystem?.db?.query !== "function") {
        return 0
    }

    const totalCapacityQuery = participantsCapacityCountSqlTotal.value;
    if (!totalCapacityQuery) return 0;

    try {
        if (value.value === 'all') {
            const result = selectedSystemStore.selectedSystem.db.query(totalCapacityQuery)?.results || [];
            return result[0]?.count || 0;
        } else {
            const sessionId = Number(value.value);
            const result = selectedSystemStore.selectedSystem.db.query(totalCapacityQuery, [sessionId])?.results || [];
            return result[0]?.count || 0;
        }
    } catch (error) {
        console.error('Error querying total capacity:', error);
        return 0;
    }
})

const currentCount = computed(() => {
    const _ = selectedSystemStore.dbNumber
    if (!selectedSystemStore.selectedSystem?.db || typeof selectedSystemStore.selectedSystem?.db?.query !== "function") {
        return 0
    }

    const currentCountQuery = participantsCapacityCountSqlCurrent.value;
    if (!currentCountQuery) return 0;

    try {
        if (value.value === 'all') {
            const result = selectedSystemStore.selectedSystem.db.query(currentCountQuery)?.results || [];
            return result[0]?.count || 0;
        } else {
            const sessionId = Number(value.value);
            const result = selectedSystemStore.selectedSystem.db.query(currentCountQuery, [sessionId])?.results || [];
            return result[0]?.count || 0;
        }
    } catch (error) {
        console.error('Error querying current count:', error);
        return 0;
    }
})

const participantsCapacityPercentageComponent = computed(() => componentCodeStore.getComponentById('supervisors-capacity-percentage') || componentCodeStore.getDefaultComponent('supervisors-capacity-percentage'))
const correctParticipantsCapacityPercentageJs = computed(() => participantsCapacityPercentageComponent.value?.js?.['js'] || 'Math.round(currentCount / totalCapacity * 100)')
const participantsCapacityPercentageJs = computed(() => ComponentHandler.getComponentValue('supervisors-capacity-percentage', 'js', correctParticipantsCapacityPercentageJs.value))

const fillPercentage = computed(() => {
    const _ = selectedSystemStore.dbNumber
    if (totalCapacity.value === 0) {
        return 0;
    }

    const fillPercentageJs = participantsCapacityPercentageJs.value;
    if (!fillPercentageJs) return 0;

    try {
        const fillPercentageFunction = new Function('currentCount', 'totalCapacity', `return ${fillPercentageJs}`);
        return fillPercentageFunction(currentCount.value, totalCapacity.value);
    } catch (error) {
        console.error('Error evaluating fillPercentageJs:', error);
        return 0;
    }
})

const selectedSessionInfo = computed(() => ({
    currentCount: currentCount.value,
    totalCapacity: totalCapacity.value,
    fillPercentage: fillPercentage.value,
    isFull: currentCount.value >= totalCapacity.value,
    isNearFull: fillPercentage.value >= 80
}))
</script>
