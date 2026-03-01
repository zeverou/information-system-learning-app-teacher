<template>
    <div v-if="selectedSessionInfo" class="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
        <UIcon name="i-heroicons-users" class="w-4 h-4 text-gray-600" />

        <!-- Session Capacity Count -->
        <div v-if="value === 'all'" class="highlightable" :id="'participants-capacity-count'"
            @click="highlightStore.isHighlightMode && highlightStore.highlightHandler.selectElement('participants-capacity-count', $event)">
            <div class="component-wrapper">
                <span class="text-sm font-medium text-gray-700">
                    {{ t('capacity') }}: {{ currentCount }}/{{ totalCapacity }}
                </span>
                <EditComponentModalOpenButton v-if="highlightStore.isEditModeActive"
                    :componentId="'participants-capacity-count'" class="edit-button" />
            </div>
        </div>
        <div v-else class="highlightable" :id="'participants-capacity-count-session'"
            @click="highlightStore.isHighlightMode && highlightStore.highlightHandler.selectElement('participants-capacity-count-session', $event)">
            <div class="component-wrapper">
                <span class="text-sm font-medium text-gray-700">
                    {{ t('capacity') }}: {{ currentCount }}/{{ totalCapacity }}
                </span>
                <EditComponentModalOpenButton v-if="highlightStore.isEditModeActive"
                    :componentId="'participants-capacity-count-session'" class="edit-button" />
            </div>
        </div>

        <!-- Session Capacity Percentage -->
        <div class="highlightable" :id="'participants-capacity-percentage'"
            @click="highlightStore.isHighlightMode && highlightStore.highlightHandler.selectElement('participants-capacity-percentage', $event)">
            <div class="component-wrapper">
                <span :style="{
                    color: darkenColor(getCapacityBadgeColor(fillPercentage), 0.3),
                    backgroundColor: lightenColor(getCapacityBadgeColor(fillPercentage), 0.8),
                    fontWeight: 'bold',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    border: '1px solid rgba(0, 0, 0, 0.1)'
                }">
                    {{ fillPercentage }}%
                </span>
                <EditComponentModalOpenButton v-if="highlightStore.isEditModeActive"
                    :componentId="'participants-capacity-percentage'" class="edit-button" />
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

const participantsCapacityCountComponent = computed(() => componentCodeStore.getComponentById('participants-capacity-count') || componentCodeStore.getDefaultComponent('participants-capacity-count'))
const participantsCapacityCountSessionComponent = computed(() => componentCodeStore.getComponentById('participants-capacity-count-session') || componentCodeStore.getDefaultComponent('participants-capacity-count-session'))

const correctParticipantsCapacityCountSqlTotalAll = computed(() => participantsCapacityCountComponent.value?.sql?.['sql-total-all'] || '')
const correctParticipantsCapacityCountSqlCurrentAll = computed(() => participantsCapacityCountComponent.value?.sql?.['sql-current-all'] || '')

const correctParticipantsCapacityCountSqlTotalSession = computed(() => participantsCapacityCountSessionComponent.value?.sql?.['sql-total-session'] || '')
const correctParticipantsCapacityCountSqlCurrentSession = computed(() => participantsCapacityCountSessionComponent.value?.sql?.['sql-current-session'] || '')

const participantsCapacityCountSqlTotal = computed(() => {
    if (value.value === 'all') {
        return ComponentHandler.getComponentValue('participants-capacity-count', 'sql-total-all', correctParticipantsCapacityCountSqlTotalAll.value)
    } else {
        return ComponentHandler.getComponentValue('participants-capacity-count-session', 'sql-total-session', correctParticipantsCapacityCountSqlTotalSession.value)
    }
})

const participantsCapacityCountSqlCurrent = computed(() => {
    if (value.value === 'all') {
        return ComponentHandler.getComponentValue('participants-capacity-count', 'sql-current-all', correctParticipantsCapacityCountSqlCurrentAll.value)
    } else {
        return ComponentHandler.getComponentValue('participants-capacity-count-session', 'sql-current-session', correctParticipantsCapacityCountSqlCurrentSession.value)
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

const participantsCapacityPercentageComponent = computed(() => componentCodeStore.getComponentById('participants-capacity-percentage') || componentCodeStore.getDefaultComponent('participants-capacity-percentage'))
const correctParticipantsCapacityPercentageJs = computed(() => participantsCapacityPercentageComponent.value?.js?.['js'] || 'Math.round(currentCount / totalCapacity * 100)')
const participantsCapacityPercentageJs = computed(() => ComponentHandler.getComponentValue('participants-capacity-percentage', 'js', correctParticipantsCapacityPercentageJs.value))

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

function lightenColor(color: string, percent: number): string {
    const colorMap: Record<string, string> = {
        'red': '#ff0000',
        'yellow': '#ffff00',
        'green': '#00ff00'
    };
    if (colorMap[color]) {
        color = colorMap[color] as string;
    }
    let r: number, g: number, b: number;

    if (color.startsWith('#')) {
        const hex = color.replace('#', '');
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
    } else {
        return color;
    }

    r = Math.min(255, Math.floor(r + (255 - r) * percent));
    g = Math.min(255, Math.floor(g + (255 - g) * percent));
    b = Math.min(255, Math.floor(b + (255 - b) * percent));

    return `rgb(${r}, ${g}, ${b})`;
}

function darkenColor(color: string, percent: number): string {
    const colorMap: Record<string, string> = {
        'red': '#ff0000',
        'yellow': '#ffff00',
        'green': '#00ff00'
    };
    if (colorMap[color]) {
        color = colorMap[color] as string;
    }
    let r: number, g: number, b: number;

    if (color.startsWith('#')) {
        const hex = color.replace('#', '');
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
    } else {
        return color;
    }

    r = Math.max(0, Math.floor(r * (1 - percent)));
    g = Math.max(0, Math.floor(g * (1 - percent)));
    b = Math.max(0, Math.floor(b * (1 - percent)));

    return `rgb(${r}, ${g}, ${b})`;
}

const getCapacityBadgeColor = (percentage: number): 'red' | 'yellow' | 'green' => {
    if (percentage >= 90) return 'red'
    if (percentage >= 70) return 'yellow'
    return 'green'
}
</script>
