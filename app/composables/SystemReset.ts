/* 1. Imports */
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { NavigationMenuItem } from '@nuxt/ui'
import { useHighlightStore } from '~/stores/useHighlightStore'
import { ComponentHandler, TaskQueue, useScoreStore } from '#imports'
import { useErrorComponentStore } from '#imports'
import { Task } from '~/model/Task'
import { useSelectedTaskStore } from '#imports'
import { useSelectedSystemStore } from '#imports'
import { useSettingsStore } from '#imports'
import { useInformationSystemStore } from '#imports'
import { useComponentCodeStore } from '#imports';
import type { InformationSystem } from '~/model/InformationSystem'

/* 5. Props */
// none

/* 6. Emits */
// none

/* 7. Template refs */
// none

export class SystemReset {

    static async refreshComponentsCore() {
        const componentCodeStore = useComponentCodeStore();
        console.log("Refreshing components...");
        componentCodeStore.resetAllComponents();
    }

    static async refreshTasksCore() {
        const selectedTaskStore = useSelectedTaskStore();
        const informationSystemStore = useInformationSystemStore();
        const scoreStore = useScoreStore();
        const errorComponentStore = useErrorComponentStore();

        selectedTaskStore.resetTasks()
        scoreStore.resetScore()
        errorComponentStore.clearErrorComponents()
        ComponentHandler.getComponentMap(selectedTaskStore.currentRound)

        for (let j = 0; j < informationSystemStore.systems.length; j++) {
            const system = informationSystemStore.systems[j];
            for (let i = 0; i < system.tasks.length; i++) {
                system.tasks[i].completed = false;
                system.tasks[i].componentsRepaired = false;
            }
        }
    }

    static async refreshDatabaseCore() {
        const selectedSystemStore = useSelectedSystemStore();
        selectedSystemStore.dbRefreshed = false;

        console.log("Refreshing database of the system:", selectedSystemStore.selectedSystem?.id);

        if (selectedSystemStore.selectedSystem) {
            // Use the store's initializeDb method which handles static initialization correctly
            await selectedSystemStore.initializeDb();
        }
        selectedSystemStore.dbRefreshed = true;
    }

}