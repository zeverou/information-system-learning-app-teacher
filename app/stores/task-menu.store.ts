export const useTaskMenuStore = defineStore('taskMenu', () => {

    const taskMenuOpened: Ref<boolean> = ref(true);
    const taskMenuDisplayedAsSidebar: Ref<boolean> = ref(true);

    function toggleTaskMenu() {
        taskMenuOpened.value = !taskMenuOpened.value
    }

    function toggleTaskMenuDisplay() {
        taskMenuDisplayedAsSidebar.value = !taskMenuDisplayedAsSidebar.value
    }

    return {
        taskMenuOpened,
        toggleTaskMenu,
        taskMenuDisplayedAsSidebar,
        toggleTaskMenuDisplay
    }
})