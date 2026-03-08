<template>
    <div class="preview-card">
        <div v-if="showHeader" class="preview-card__header">
            <span class="preview-card__name">{{ component?.name }}</span>
            <span v-if="component?.description" class="preview-card__desc">{{ component.description }}</span>
        </div>
        <div class="preview-card__body">
            <iframe v-if="srcdoc" :srcdoc="srcdoc" class="preview-card__iframe" sandbox="allow-scripts"
                referrerpolicy="no-referrer" scrolling="auto" />
            <div v-else class="preview-card__empty">
                <span>No HTML content to preview</span>
            </div>
        </div>
        <div v-if="component" class="preview-card__code-blocks">
            <CodeBlock v-if="htmlContent" :code="htmlContent" language="html" label="HTML" :read-only="true" height="150px" />
            <CodeBlock v-if="cssContent" :code="cssContent" language="css" label="CSS" :read-only="true" height="150px" />
            <CodeBlock v-if="jsContent" :code="jsContent" language="javascript" label="JS" :read-only="true" height="150px" />
            <CodeBlock v-if="sqlContent" :code="sqlContent" language="sql" label="SQL" :read-only="true" height="150px" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Component } from '~/model/Component';

const props = defineProps<{
    component: Component | null | undefined;
    showHeader?: boolean;
}>();

const showHeader = computed(() => props.showHeader !== false);

const htmlContent = computed(() => props.component?.html ?? '');
const cssContent = computed(() => props.component?.css ?? '');
const jsContent = computed(() => props.component?.js ?? '');
const sqlContent = computed(() => props.component?.sql ?? '');

const srcdoc = computed(() => {
    const html = htmlContent.value.trim();
    const css = cssContent.value.trim();
    if (!html && !css) return '';
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { margin: 0; padding: 12px; font-family: inherit; }
    ${css}
  </style>
</head>
<body>
  ${html}
</body>
</html>`;
});
</script>

<style scoped>
.preview-card {
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    overflow: hidden;
    background: var(--color-surface, #1e1e2e);
    border: 1px solid var(--color-border, rgba(255, 255, 255, 0.08));
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.25);
    transition: box-shadow 0.2s ease;
}

.preview-card:hover {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
}

.preview-card__header {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--color-border, rgba(255, 255, 255, 0.08));
    background: var(--color-surface-raised, rgba(255, 255, 255, 0.03));
}

.preview-card__name {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--color-text-primary, #cdd6f4);
    letter-spacing: 0.02em;
}

.preview-card__desc {
    font-size: 0.75rem;
    color: var(--color-text-muted, #6c7086);
}

.preview-card__body {
    flex: 1;
    min-height: 160px;
}

.preview-card__iframe {
    display: block;
    width: 100%;
    height: 100%;
    min-height: 160px;
    border: none;
    background: #fff;
}

.preview-card__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 160px;
    color: var(--color-text-muted, #6c7086);
    font-size: 0.8rem;
}

.preview-card__code-blocks {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    border-top: 1px solid var(--color-border, rgba(255, 255, 255, 0.08));
}
</style>