
export const useHighlightStore = defineStore('highlight', () => {

    const isHighlightActive = ref(false);
    const isEditModeActive = ref(false);

    const highlightedComponentsIds = ref<Set<string>>(new Set());

    function toggleHighlight(componentId: string) {
        const next = new Set(highlightedComponentsIds.value);
        if (next.has(componentId)) {
            next.delete(componentId);
        } else {
            next.add(componentId);
        }
        highlightedComponentsIds.value = next;
    }

    function toggleEditMode() {
        isEditModeActive.value = !isEditModeActive.value;
    }

    function clearHighlights() {
        highlightedComponentsIds.value = new Set();
    }
    return {
        isHighlightActive,
        isEditModeActive,
        highlightedComponentsIds,
        toggleHighlight,
        toggleEditMode,
        clearHighlights
    }
},
    {
        persist: {
            afterHydrate: (ctx) => {
                const ids = ctx.store.highlightedComponentsIds;
                if (!(ids instanceof Set)) {
                    ctx.store.highlightedComponentsIds = new Set(Array.isArray(ids) ? ids : []);
                }
            }
        }
    })