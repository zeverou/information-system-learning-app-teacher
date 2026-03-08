
export const useHighlightStore = defineStore('highlight', () => {

    const isHighlightActive = ref(false);
    const isEditModeActive = ref(false);

    const selectedHighlightedComponentsIds = ref<Set<string>>(new Set());

    function selectHighlightedComponent(componentId: string) {
        const next = new Set(selectedHighlightedComponentsIds.value);
        if (next.has(componentId)) {
            next.delete(componentId);
        } else {
            next.add(componentId);
        }
        selectedHighlightedComponentsIds.value = next;
    }

    function toggleHighlight() {
        isHighlightActive.value = !isHighlightActive.value;
    }


    function toggleEditMode() {
        isEditModeActive.value = !isEditModeActive.value;
    }

    function clearHighlights() {
        selectedHighlightedComponentsIds.value = new Set();
    }
    return {
        isHighlightActive,
        isEditModeActive,
        selectedHighlightedComponentsIds,
        selectHighlightedComponent,
        toggleHighlight,
        toggleEditMode,
        clearHighlights
    }
},
    {
        persist: {
            afterHydrate: (ctx) => {
                const ids = ctx.store.selectedHighlightedComponentsIds;
                if (!(ids instanceof Set)) {
                    ctx.store.selectedHighlightedComponentsIds = new Set(Array.isArray(ids) ? ids : []);
                }
            }
        }
    })