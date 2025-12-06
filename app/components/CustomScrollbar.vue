<template>
  <div 
    ref="containerRef" 
    class="custom-scrollbar-container"
    @mouseenter="showScrollbar = true"
    @mouseleave="showScrollbar = false"
  >
    <div 
      ref="contentRef" 
      class="custom-scrollbar-content"
      @scroll="onScroll"
    >
      <slot />
    </div>
    
    <transition name="scrollbar-fade">
      <div 
        v-show="showScrollbar && hasOverflow"
        class="scrollbar-track"
        @mousedown.prevent="onTrackClick"
      >
        <div 
          ref="thumbRef"
          class="scrollbar-thumb"
          :style="thumbStyle"
          @mousedown.prevent="onThumbMouseDown"
        />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

const containerRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const thumbRef = ref<HTMLElement | null>(null)

const showScrollbar = ref(false)
const isDragging = ref(false)
const scrollTop = ref(0)
const scrollHeight = ref(0)
const clientHeight = ref(0)
const dragStartY = ref(0)
const dragStartScrollTop = ref(0)

const hasOverflow = computed(() => scrollHeight.value > clientHeight.value)

const thumbHeight = computed(() => {
  if (!hasOverflow.value) return 0
  const ratio = clientHeight.value / scrollHeight.value
  return Math.max(ratio * clientHeight.value, 30)
})

const thumbTop = computed(() => {
  if (!hasOverflow.value) return 0
  const scrollRatio = scrollTop.value / (scrollHeight.value - clientHeight.value)
  return scrollRatio * (clientHeight.value - thumbHeight.value)
})

const thumbStyle = computed(() => ({
  height: `${thumbHeight.value}px`,
  transform: `translateY(${thumbTop.value}px)`
}))

function updateScrollMetrics() {
  if (contentRef.value) {
    scrollTop.value = contentRef.value.scrollTop
    scrollHeight.value = contentRef.value.scrollHeight
    clientHeight.value = contentRef.value.clientHeight
  }
}

function onScroll() {
  updateScrollMetrics()
}

function onTrackClick(e: MouseEvent) {
  if (!contentRef.value || !containerRef.value) return
  
  const trackRect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const clickY = e.clientY - trackRect.top
  const targetScrollRatio = clickY / clientHeight.value
  const targetScrollTop = targetScrollRatio * (scrollHeight.value - clientHeight.value)
  
  contentRef.value.scrollTo({
    top: targetScrollTop,
    behavior: 'smooth'
  })
}

function onThumbMouseDown(e: MouseEvent) {
  isDragging.value = true
  dragStartY.value = e.clientY
  dragStartScrollTop.value = scrollTop.value
  showScrollbar.value = true
  
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
  document.body.style.userSelect = 'none'
}

function onMouseMove(e: MouseEvent) {
  if (!isDragging.value || !contentRef.value) return
  
  const deltaY = e.clientY - dragStartY.value
  const scrollRatio = deltaY / (clientHeight.value - thumbHeight.value)
  const newScrollTop = dragStartScrollTop.value + scrollRatio * (scrollHeight.value - clientHeight.value)
  
  contentRef.value.scrollTop = Math.max(0, Math.min(newScrollTop, scrollHeight.value - clientHeight.value))
}

function onMouseUp() {
  isDragging.value = false
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
  document.body.style.userSelect = ''
}

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  nextTick(() => {
    updateScrollMetrics()
    
    if (contentRef.value) {
      resizeObserver = new ResizeObserver(() => {
        updateScrollMetrics()
      })
      resizeObserver.observe(contentRef.value)
    }
  })
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
})
</script>

<style scoped>
.custom-scrollbar-container {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.custom-scrollbar-content {
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.custom-scrollbar-content::-webkit-scrollbar {
  display: none;
}

.scrollbar-track {
  position: absolute;
  top: 4px;
  right: 4px;
  bottom: 4px;
  width: 6px;
  border-radius: 3px;
  background: transparent;
}

.scrollbar-thumb {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  border-radius: 3px;
  background: rgba(150, 150, 150, 0.4);
  cursor: pointer;
  transition: background 0.2s ease, width 0.2s ease;
}

.scrollbar-thumb:hover,
.scrollbar-thumb:active {
  background: rgba(150, 150, 150, 0.7);
  width: 8px;
  left: -1px;
}

.scrollbar-fade-enter-active,
.scrollbar-fade-leave-active {
  transition: opacity 0.3s ease;
}

.scrollbar-fade-enter-from,
.scrollbar-fade-leave-to {
  opacity: 0;
}

/* Dark mode support */
:root.dark .scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
}

:root.dark .scrollbar-thumb:hover,
:root.dark .scrollbar-thumb:active {
  background: rgba(255, 255, 255, 0.4);
}
</style>
