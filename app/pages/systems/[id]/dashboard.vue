<template>
    <div class="p-6 flex flex-col gap-8 max-w-7xl mx-auto">

        <SystemHeroCard class="mt-6" />

        <div class="flex flex-row gap-4">
            <ComponentWrapper :component="participantsStat" />
            <ComponentWrapper :component="sessionsStat" />
            <ComponentWrapper :component="supervisorsStat" />
            <ComponentWrapper :component="mealsStat" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ComponentWrapper from '~/components/ComponentWrapper.vue';
import { useSystemsStore } from '~/stores/systemsStore';
import { useRoute } from 'vue-router';

const route = useRoute();
const systemsStore = useSystemsStore();
const systemId = route.params.id as string;

// Set current system ID
systemsStore.selectedSystemId = systemId;

// check if db is initialized, if not, initialize it and load systems
if (await systemsStore.selectedSystem?.database?.isDatabaseInitialized() === false) {
    console.error("Initializing database for system " + systemId)
} else {
    console.log("Database for system " + systemId + " is already initialized")
}



const participantsStat = computed(() => systemsStore.getComponentById('stats-participants'));
const sessionsStat = computed(() => systemsStore.getComponentById('stats-sessions'));
const supervisorsStat = computed(() => systemsStore.getComponentById('stats-supervisors'));
const mealsStat = computed(() => systemsStore.getComponentById('stats-meals'));
</script>