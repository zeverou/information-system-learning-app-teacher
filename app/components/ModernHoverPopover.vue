<template>
  <div class="modern-hover-popover">
    <slot />

    <div class="modern-hover-popover__panel" role="tooltip">
      <div class="modern-hover-popover__icon">
        <UIcon :name="icon" class="modern-hover-popover__icon-symbol" />
      </div>
      <div class="modern-hover-popover__content">
        <div class="modern-hover-popover__title">{{ title }}</div>
        <div class="modern-hover-popover__description">{{ description }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  description: string
  icon?: string
}>(), {
  icon: 'i-heroicons-information-circle'
})
</script>

<style scoped>
.modern-hover-popover {
  position: relative;
  display: inline-flex;
}

.modern-hover-popover__panel {
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  z-index: 40;
  display: flex;
  width: min(22rem, calc(100vw - 2rem));
  gap: 0.75rem;
  padding: 0.875rem;
  color: #111827;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(229, 231, 235, 0.92);
  border-radius: 0.75rem;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.16), 0 4px 12px rgba(15, 23, 42, 0.08);
  opacity: 0;
  pointer-events: none;
  transform: translateX(-50%) translateY(-4px) scale(0.98);
  transform-origin: top center;
  transition: opacity 150ms ease, transform 150ms ease;
}

.modern-hover-popover:hover .modern-hover-popover__panel,
.modern-hover-popover:focus-within .modern-hover-popover__panel {
  opacity: 1;
  transform: translateX(-50%) translateY(0) scale(1);
}

.modern-hover-popover__panel::before {
  content: "";
  position: absolute;
  top: -5px;
  left: 50%;
  width: 10px;
  height: 10px;
  background: rgba(255, 255, 255, 0.96);
  border-left: 1px solid rgba(229, 231, 235, 0.92);
  border-top: 1px solid rgba(229, 231, 235, 0.92);
  transform: translateX(-50%) rotate(45deg);
}

.modern-hover-popover__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  flex: 0 0 auto;
  border-radius: 0.625rem;
  color: #ea580c;
  background: #fff7ed;
  border: 1px solid #fed7aa;
}

.modern-hover-popover__icon-symbol {
  width: 1.05rem;
  height: 1.05rem;
}

.modern-hover-popover__content {
  min-width: 0;
}

.modern-hover-popover__title {
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.25rem;
  color: #111827;
}

.modern-hover-popover__description {
  margin-top: 0.125rem;
  font-size: 0.8125rem;
  line-height: 1.25rem;
  color: #4b5563;
}

@media (prefers-color-scheme: dark) {
  .modern-hover-popover__panel {
    color: #f9fafb;
    background: rgba(17, 24, 39, 0.96);
    border-color: rgba(55, 65, 81, 0.92);
    box-shadow: 0 18px 45px rgba(0, 0, 0, 0.35), 0 4px 12px rgba(0, 0, 0, 0.24);
  }

  .modern-hover-popover__panel::before {
    background: rgba(17, 24, 39, 0.96);
    border-color: rgba(55, 65, 81, 0.92);
  }

  .modern-hover-popover__title {
    color: #f9fafb;
  }

  .modern-hover-popover__description {
    color: #d1d5db;
  }
}
</style>
