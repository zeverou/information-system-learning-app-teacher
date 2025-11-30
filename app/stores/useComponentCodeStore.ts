import { defineStore } from 'pinia'
import { reactive, watch, computed } from 'vue'
import { Component } from '~/model/Component'
import { IndexedDbHandler } from '~/utils/IndexedDbHandler'
import { useSelectedSystemStore } from './useSelectedSystemStore'

export const useComponentCodeStore = defineStore('componentCode', () => {

  const selectedSystemStore = useSelectedSystemStore()

  // Use computed properties to delegate to the current system's component maps
  const state = reactive({
    get defaultComponentMap() {
      return selectedSystemStore.selectedSystem?.defaultComponentMap || []
    },
    set defaultComponentMap(value: Component[]) {
      if (selectedSystemStore.selectedSystem) {
        selectedSystemStore.selectedSystem.defaultComponentMap = value
      }
    },
    get actualComponentMap() {
      return selectedSystemStore.selectedSystem?.actualComponentMap || []
    },
    set actualComponentMap(value: Component[]) {
      if (selectedSystemStore.selectedSystem) {
        selectedSystemStore.selectedSystem.actualComponentMap = value
      }
    }
  })

  function getDefaultComponentMap() {
    return state.defaultComponentMap
  }

  function getActualComponentMap() {
    return state.actualComponentMap
  }

  // New methods for Component instances
  function updateDefaultComponent(component: Component) {
    console.log("Updating default component with id:", component.id)
    if (!selectedSystemStore.selectedSystem) return

    const index = selectedSystemStore.selectedSystem.defaultComponentMap.findIndex(c => c.id === component.id)
    if (index >= 0) {
      selectedSystemStore.selectedSystem.defaultComponentMap[index] = component
    } else {
      selectedSystemStore.selectedSystem.defaultComponentMap.push(component)
    }
    // Save complete system to IndexedDB
    selectedSystemStore.selectedSystem.saveToIndexedDB()
  }

  function getComponentById(id: string): Component | undefined {
    return selectedSystemStore.selectedSystem?.actualComponentMap.find(c => c.id === id)
  }

  function getDefaultComponent(id: string): Component | undefined {
    return selectedSystemStore.selectedSystem?.defaultComponentMap.find(c => c.id === id)
  }

  function updateActualComponent(component: Component) {
    console.log("Updating actual component with id:", component.id)
    if (!selectedSystemStore.selectedSystem) return

    const index = selectedSystemStore.selectedSystem.actualComponentMap.findIndex(c => c.id === component.id)
    if (index >= 0) {
      selectedSystemStore.selectedSystem.actualComponentMap[index] = component
    } else {
      selectedSystemStore.selectedSystem.actualComponentMap.push(component)
    }
    // Save complete system to IndexedDB
    selectedSystemStore.selectedSystem.saveToIndexedDB()
  }

  function getActualComponent(id: string): Component | undefined {
    return selectedSystemStore.selectedSystem?.actualComponentMap.find(c => c.id === id)
  }

  function resetComponent(id: string) {
    console.log("Resetting component with id:", id)
    const defaultComp = getDefaultComponent(id)
    if (defaultComp) {
      updateActualComponent(defaultComp)
    }
  }

  function resetAllComponents() {
    console.log("Resetting all components to default")
    if (!selectedSystemStore.selectedSystem) return

    selectedSystemStore.selectedSystem.actualComponentMap.splice(0, selectedSystemStore.selectedSystem.actualComponentMap.length)
    selectedSystemStore.selectedSystem.actualComponentMap.push(...selectedSystemStore.selectedSystem.defaultComponentMap)
    // Save complete system to IndexedDB
    selectedSystemStore.selectedSystem.saveToIndexedDB()
  }

  function updateComponent(id: string, component: Component) {
    console.log("Updating component with id:", id)
    if (!selectedSystemStore.selectedSystem) return

    const index = selectedSystemStore.selectedSystem.actualComponentMap.findIndex(c => c.id === id)
    if (index >= 0) {
      selectedSystemStore.selectedSystem.actualComponentMap[index] = component
    } else {
      selectedSystemStore.selectedSystem.actualComponentMap.push(component)
    }
    // Save complete system to IndexedDB
    selectedSystemStore.selectedSystem.saveToIndexedDB()
  }

  // New methods to get specific component code by type
  function getComponentCodeByType(componentId: string, codeType: 'html' | 'css' | 'js' | 'sql', specificKey?: string): string {
    const component = getComponentById(componentId) || getDefaultComponent(componentId)
    if (!component) return ''
    
    const codeMap = component[codeType]
    if (!codeMap) return ''
    
    // If specific key is provided, use it; otherwise try the codeType or 'default'
    const key = specificKey || codeType || 'default'
    return codeMap[key] || codeMap['default'] || ''
  }

  function updateComponentCodeByType(componentId: string, codeType: 'html' | 'css' | 'js' | 'sql', code: string, specificKey?: string) {
    let component = getComponentById(componentId)
    
    if (!component) {
      const defaultComponent = getDefaultComponent(componentId)
      if (!defaultComponent) return
      
      // Create a copy of default component for actual use
      component = {
        ...defaultComponent,
        html: { ...defaultComponent.html },
        css: { ...defaultComponent.css },
        js: { ...defaultComponent.js },
        sql: { ...defaultComponent.sql }
      }
      if (selectedSystemStore.selectedSystem) {
        selectedSystemStore.selectedSystem.actualComponentMap.push(component)
      }
    }
    
    const key = specificKey || codeType || 'default'
    component[codeType][key] = code
    // Save complete system to IndexedDB
    selectedSystemStore.selectedSystem?.saveToIndexedDB()
  }

  // Watch for unexpected changes to the maps so we can trace who modifies the store (useful for debugging F5/rehydration behavior)
  try {
    watch(() => selectedSystemStore.selectedSystem?.actualComponentMap.length, (newLen, oldLen) => {
      console.trace('[componentCodeStore] actualComponentMap length changed', oldLen, '->', newLen)
    }, { immediate: true })

    watch(() => selectedSystemStore.selectedSystem?.defaultComponentMap.length, (newLen, oldLen) => {
      console.trace('[componentCodeStore] defaultComponentMap length changed', oldLen, '->', newLen)
    }, { immediate: true })
  } catch (e) {
    // In some runtime environments or during SSR, watch might not be available; swallow errors
    console.debug('[componentCodeStore] watch init failed', e)
  }

  return {
    ...state,
    getDefaultComponentMap,
    getActualComponentMap,
    updateDefaultComponent,
    getDefaultComponent,
    updateActualComponent,
    getActualComponent,
    resetComponent,
    resetAllComponents,
    getComponentById,
    updateComponent,
    getComponentCodeByType,
    updateComponentCodeByType
  }
})