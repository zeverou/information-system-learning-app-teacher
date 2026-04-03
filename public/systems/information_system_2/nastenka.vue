<template>
    <div class="p-6 flex flex-col gap-8 max-w-7xl mx-auto">
        <ComponentWrapper :component="dashboardHeroCard" class="mt-6" />
        <div class="flex flex-row gap-4">
            <ComponentWrapper :component="participantsStat" />
            <ComponentWrapper :component="sessionsStat" />
            <ComponentWrapper :component="supervisorsStat" />
            <ComponentWrapper :component="mealsStat" />
        </div>
    </div>
</template>

<script setup>
const route = useRoute();
const systemsStore = useSystemsStore();
const systemId = route.params.id;

systemsStore.selectedSystemId = systemId;

if (await DatabaseWrapper.isDatabaseInitialized(systemsStore.selectedSystem?.database) === false) {
    console.error("Initializing database for system " + systemId)
} else {
    console.log("Database for system " + systemId + " is already initialized")
}

const dashboardHeroCard = computed(() => systemsStore.getComponentById('system-hero-card'));
const participantsStat = computed(() => systemsStore.getComponentById('stats-participants'));
const sessionsStat = computed(() => systemsStore.getComponentById('stats-sessions'));
const supervisorsStat = computed(() => systemsStore.getComponentById('stats-supervisors'));
const mealsStat = computed(() => systemsStore.getComponentById('stats-meals'));
</script>