<template>
    <div class="p-6 flex flex-col gap-8 max-w-7xl mx-auto">
        <ComponentWrapper :component="dashboardHeroCard" class="mt-6" />
        <div class="flex flex-row gap-4">
            <ComponentWrapper :component="participantsStat" />
            <ComponentWrapper :component="sessionsStat" />
            <ComponentWrapper :component="supervisorsStat" />
            <ComponentWrapper :component="mealsStat" />
        </div>
        <USeparator />

        <h2 class="text-2xl font-semibold">Statistiky</h2>
        <div class="flex flex-row gap-4 flex-wrap">
            <ComponentWrapper :component="minParticipantsPerSessionStat" />
            <ComponentWrapper :component="maxParticipantsPerSessionStat" />
            <ComponentWrapper :component="totalParticipantsInSessionsStat" />
            <ComponentWrapper :component="maxParticipantAgeStat" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ComponentWrapper from '~/components/ComponentWrapper.vue';
const { systemsStore } = useSyncSystemId();

const dashboardHeroCard = computed(() => systemsStore.getComponentById('hlavni-karta-systemu'));
const participantsStat = computed(() => systemsStore.getComponentById('statistika-ucastniku'));
const sessionsStat = computed(() => systemsStore.getComponentById('statistika-turnusu'));
const supervisorsStat = computed(() => systemsStore.getComponentById('statistika-vedoucich'));
const mealsStat = computed(() => systemsStore.getComponentById('statistika-jidel'));
const minParticipantsPerSessionStat = computed(() => systemsStore.getComponentById('statistika-min-ucastniku-turnusu'));
const maxParticipantsPerSessionStat = computed(() => systemsStore.getComponentById('statistika-max-ucastniku-turnusu'));
const totalParticipantsInSessionsStat = computed(() => systemsStore.getComponentById('statistika-celkem-ucasti-turnusu'));
const maxParticipantAgeStat = computed(() => systemsStore.getComponentById('statistika-max-vek-ucastnika'));
</script>
