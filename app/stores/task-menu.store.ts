export const useTaskMenuStore = defineStore('taskMenu', () => {

    const taskMenuOpened: Ref<boolean> = ref(true);
    const taskMenuDisplayedAsSidebar: Ref<boolean> = ref(true);
    const sidebarCollapsed: Ref<boolean> = ref(false);

    function toggleTaskMenu() {
        taskMenuOpened.value = !taskMenuOpened.value
    }

    function toggleTaskMenuDisplay() {
        taskMenuDisplayedAsSidebar.value = !taskMenuDisplayedAsSidebar.value
    }

    function toggleSidebarCollapsed() {
        sidebarCollapsed.value = !sidebarCollapsed.value
    }


    return {
        taskMenuOpened,
        toggleTaskMenu,
        taskMenuDisplayedAsSidebar,
        toggleTaskMenuDisplay,
        sidebarCollapsed,
        toggleSidebarCollapsed
    }
})