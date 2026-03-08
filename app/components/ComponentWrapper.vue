<template>
    <div @click="handleHighlightClick"
        :class="['component-wrapper', { 'highlight-active': highlightStore.isHighlightActive, 'is-highlighted': highlightStore.isHighlightActive && highlightStore.selectedHighlightedComponentsIds.has(props.component.id) }]">
        <div :class="['content-container', { 'edit-mode': isEditEnabled }]">

            <span v-if="isEditEnabled" class="edit-icon" @click.stop="handleEdit">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    <path d="m15 5 4 4" />
                </svg>
            </span>

            <div class="component-html"
                v-html="HtmlHandler.ReplaceHtmlForVariables(componentVariables, props.component.html)"></div>
        </div>

        <UModal v-model:open="isEditModalOpened" :dismissible="false" :ui="{ content: 'w-[80vw] max-w-[80vw]' }">
            <template #title>
                <div class="flex items-center gap-2">
                    <span>Edit Component</span>
                    <UBadge color="neutral" variant="subtle" size="sm" class="font-mono">{{ props.component.id }}
                    </UBadge>
                </div>
            </template>
            <template #body>
                <div class="flex flex-col gap-4">
                    <div class="flex items-center gap-2 justify-end -mt-2">
                        <UButton icon="i-lucide-minus" color="neutral" variant="ghost"
                            @click="sizeMultiplier -= 0.05" />
                        <span class="text-xs text-gray-500 font-medium w-10 text-center">{{ Math.round(sizeMultiplier *
                            100) }}%</span>
                        <UButton icon="i-lucide-plus" color="neutral" variant="ghost" @click="sizeMultiplier += 0.05" />
                    </div>
                    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 w-full">
                        <CodeBlock v-model:code="editedHtml" language="html" label="HTML" height="400px"
                            :correct="undefined" :size-multiplier="sizeMultiplier" />
                        <CodeBlock v-model:code="editedCss" language="css" label="CSS" height="400px"
                            :correct="undefined" :size-multiplier="sizeMultiplier" />
                        <CodeBlock v-model:code="editedJs" language="typescript" label="JS" height="400px"
                            :correct="undefined" :protected-prefix="sqlVarsHeader || undefined"
                            :size-multiplier="sizeMultiplier" />
                        <CodeBlock v-model:code="editedSql" language="sql" label="SQL" height="400px"
                            :correct="isEditedSqlValid" :size-multiplier="sizeMultiplier" />
                    </div>

                    <USeparator />

                    <div v-if="generalVariableNames.length > 0" class="mt-2 text-left">
                        <p
                            class="text-xs text-left font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
                            Available General variables
                        </p>
                        <div class="flex flex-wrap gap-2 text-left">
                            <div v-for="name in generalVariableNames" :key="name" class="general-var-card text-left">
                                <span class="general-var-name">{{ name }}</span>
                                <span class="general-var-value">{{ formatGeneralVariablePreview(name) }}</span>
                            </div>
                        </div>
                    </div>
                    <div v-else class="mt-2 text-left">
                        <p
                            class="text-xs text-left font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
                            Available General variables
                        </p>
                        <div
                            class="flex flex-row items-center gap-2 py-2 px-4 w-fit bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
                            <UIcon name="i-lucide-box" class="w-5 h-5 text-gray-400" />
                            <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">No valid general variables
                                found</p>
                        </div>
                    </div>

                    <div v-if="sqlVariableNames.length > 0" class="mt-2">
                        <p class="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-2">
                            Available SQL variables
                        </p>
                        <div class="flex flex-wrap gap-2">
                            <div v-for="name in sqlVariableNames" :key="name" class="sql-var-card">
                                <span class="sql-var-name">{{ name }}</span>
                                <span class="sql-var-value">{{ formatSqlVariablePreview(name) }}</span>
                            </div>
                        </div>
                    </div>
                    <div v-else class="mt-2">
                        <p class="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-2">
                            Available SQL variables
                        </p>
                        <div
                            class="flex flex-row items-center gap-2 py-2 px-4 w-fit bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
                            <UIcon name="i-lucide-database-zap" class="w-5 h-5 text-gray-400" />
                            <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">No valid SQL variables found
                            </p>
                        </div>
                    </div>

                    <div v-if="jsVariableNames.length > 0" class="mt-2">
                        <p
                            class="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                            Available JS variables
                        </p>
                        <div class="flex flex-wrap gap-2">
                            <div v-for="name in jsVariableNames" :key="name" class="js-var-card">
                                <span class="js-var-name">{{ name }}</span>
                                <span class="js-var-value">{{ formatJsVariablePreview(name) }}</span>
                            </div>
                        </div>
                    </div>
                    <div v-else class="mt-2">
                        <p
                            class="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                            Available JS variables
                        </p>
                        <div
                            class="flex flex-row items-center gap-2 py-2 px-4 w-fit bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
                            <UIcon name="i-lucide-code-2" class="w-5 h-5 text-gray-400" />
                            <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">No valid JS variables found
                            </p>
                        </div>
                    </div>
                    <div class="flex justify-end gap-3 mt-4">
                        <UButton @click="closeEdit" variant="outline" color="neutral">Cancel</UButton>
                        <UButton @click="saveEdit" color="sky" :disabled="!isEditedSqlValid">Save Changes</UButton>
                    </div>
                </div>
            </template>
        </UModal>
    </div>
</template>

<script setup lang="ts">
import type { QueryExecResult } from 'sql.js';
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { SqlHandler } from '~/core/SqlHandler';
import { JsHandler } from '~/core/JsHandler';
import { HtmlHandler } from '~/core/HtmlHandler';
import { Component as SystemComponent } from '~/model/Component';
import { ComponentVariables } from '~/model/ComponentVariables';
import { useSystemsStore } from '~/stores/systemsStore';
import { useHighlightStore } from '~/stores/highlightStore';
import { DatabaseHandler } from '~/utils/DatabaseHandler';
import { OperationResultType } from '~/utils/OperationResultType';
import { TableMap } from '~/core/TableMap';
import { ColumnType } from '~/utils/ColumnType';
import type { VariableType } from '~/model/types/VariableType';

const props = defineProps<{
    component: SystemComponent,
    generalVariables?: Record<string, VariableType | VariableType[]>
}>()

const systemsStore = useSystemsStore();
const highlightStore = useHighlightStore();
const styleId = `component-style-${props.component.id}`;

const isEditEnabled = computed(() => highlightStore.isEditModeActive);
const isEditModalOpened = ref(false);
const editedHtml = ref('');
const editedCss = ref('');
const editedJs = ref('');
const editedSql = ref('');
const componentVariables = ref<ComponentVariables>(new ComponentVariables());
const sqlVariables = ref<TableMap[]>([]);
const queryResult = ref<QueryExecResult[]>([]);
const isEditedSqlValid = ref(true);
const sqlVariableNames = ref<string[]>([]);
const jsVariableNames = ref<string[]>([]);
const generalVariableNames = computed(() => Object.keys(componentVariables.value.generalVariables ?? {}));
const sizeMultiplier = ref(1);

/** Read-only JS constants generated from the current SQL query results.
 *  Shown as a protected header in the JS editor so user code can reference them. */
const sqlVarsHeader = computed<string>(() => {
    const vars = componentVariables.value.sqlVariables
    if (!vars || Object.keys(vars).length === 0) return ''
    return JsHandler.getSqlVariablesIntoJs(vars)
})

function handleEdit() {
    editedHtml.value = props.component.html;
    editedCss.value = props.component.css;;
    editedJs.value = props.component.js;
    editedSql.value = props.component.sql;
    isEditModalOpened.value = true;
}

function closeEdit() {
    isEditModalOpened.value = false;
}

function formatGeneralVariablePreview(name: string): string {
    const values = componentVariables.value.generalVariables?.[name];
    if (!values && values !== 0 && values !== false as any) return '—';
    if (Array.isArray(values)) {
        const preview = values.slice(0, 5).map(v => String(v)).join(', ');
        return values.length > 5 ? `${preview}, … (${values.length} total)` : preview;
    }
    return String(values);
}

function formatSqlVariablePreview(name: string): string {
    const values = componentVariables.value.sqlVariables?.[name];
    if (!values) return '—';
    if (Array.isArray(values)) {
        const preview = values.slice(0, 5).map(v => String(v)).join(', ');
        return values.length > 5 ? `${preview}, … (${values.length} total)` : preview;
    }
    return String(values);
}

function formatJsVariablePreview(name: string): string {
    const values = componentVariables.value.jsVariables?.[name];
    if (!values && values !== 0 && values !== false as any) return '—';
    if (Array.isArray(values)) {
        const preview = values.slice(0, 5).map(v => String(v)).join(', ');
        return values.length > 5 ? `${preview}, … (${values.length} total)` : preview;
    }
    return String(values);
}

async function saveEdit() {
    props.component.html = editedHtml.value;
    props.component.css = editedCss.value;
    props.component.js = editedJs.value;
    props.component.sql = editedSql.value;

    // Explicitly update component variables on save
    if (editedJs.value) {
        try { componentVariables.value.jsVariables = JsHandler.getJsVariables(editedJs.value); } catch (e) { }
    }

    isEditModalOpened.value = false;

    console.log("Saved component changes:", {
        html: props.component.html,
        css: props.component.css,
        js: props.component.js,
        sql: props.component.sql,
        variables: componentVariables.value
    });

    if (systemsStore.selectedSystem) {
        await systemsStore.updateSystem(systemsStore.selectedSystem);
    }
}

function handleHighlightClick() {
    if (highlightStore.isHighlightActive) {
        highlightStore.selectHighlightedComponent(props.component.id);
        return;
    }
    if (highlightStore.isEditModeActive) {
        handleEdit();
    }
}

function applyStyle(css: string) {
    let el = document.getElementById(styleId);
    if (!el) {
        el = document.createElement('style');
        el.id = styleId;
        document.head.appendChild(el);
    }
    console.log('[CSS] before replace:', css);
    const resolvedCss = HtmlHandler.ReplaceHtmlForVariables(componentVariables.value, css);
    console.log('[CSS] after replace:', resolvedCss);
    el.textContent = resolvedCss;
}

function removeStyle() {
    document.getElementById(styleId)?.remove();
}

onMounted(async () => {
    applyStyle(props.component.css);

    if (props.generalVariables) {
        componentVariables.value.generalVariables = { ...props.generalVariables };
    }

    // populate JS variables upfront
    if (props.component.js) {
        try {
            const vars = JsHandler.getJsVariables(props.component.js);
            componentVariables.value.jsVariables = vars;
            jsVariableNames.value = Object.keys(vars);
        } catch (e) { }
    }

    const db = systemsStore.selectedSystem?.database?.sqlJsDatabase;
    if (db && props.component.sql) {
        try {
            console.log('[SQL] before replace:', props.component.sql);
            const resolvedSql = SqlHandler.ReplaceSqlForVariables(componentVariables.value, props.component.sql);
            console.log('[SQL] after replace:', resolvedSql);
            const result = await DatabaseHandler.query(db, resolvedSql);
            queryResult.value = result.data ?? [];
            const mapRes = await DatabaseHandler.getTableColumnMap(db);
            const vars = SqlHandler.GetSqlVariableNames(resolvedSql, mapRes.data ?? {}, queryResult.value);
            sqlVariables.value = vars;

            // Re-apply component variables natively to render initially
            const initialSqlVars: Record<string, VariableType[]> = {};
            for (let i = 0; i < vars.length; i++) {
                const mapV = vars[i];
                if (!mapV) continue;
                if (!queryResult.value[0]) continue;
                const rVals = queryResult.value[0].values.map(r => r[i]);
                const t = mapV.columnType;
                initialSqlVars[mapV.variableAsName] = t === ColumnType.INTEGER || t === ColumnType.REAL
                    ? rVals.map(v => Number(v))
                    : t === ColumnType.DATE ? rVals.map(v => new Date(String(v))) : rVals.map(v => String(v));
            }
            componentVariables.value.sqlVariables = initialSqlVars;
        } catch (e) {
            console.error(e);
        }
    }
});

watch(() => props.generalVariables, (newVars) => {
    if (newVars) {
        componentVariables.value.generalVariables = { ...newVars };
    } else {
        componentVariables.value.generalVariables = undefined;
    }
}, { deep: true, immediate: true });

// watcher for edited js
watch(editedJs, (newJs) => {
    if (newJs) {
        try {
            const variables = JsHandler.getJsVariables(newJs);
            componentVariables.value.jsVariables = variables;
            jsVariableNames.value = Object.keys(variables);
        } catch (e) {
            console.error(e);
            jsVariableNames.value = [];
        }
    } else {
        jsVariableNames.value = [];
    }
}, { immediate: true });

// watcher for edited sql
watch(() => props.component.sql, async (sql) => {
    if (!sql) return;
    const db = systemsStore.selectedSystem?.database?.sqlJsDatabase;
    if (!db) return;
    try {
        console.log('[SQL watcher] before replace:', sql);
        const resolvedSql = SqlHandler.ReplaceSqlForVariables(componentVariables.value, sql);
        console.log('[SQL watcher] after replace:', resolvedSql);
        const validResult = await DatabaseHandler.isSqlValid(db, resolvedSql);
        if (validResult.result !== OperationResultType.SUCCESS) return;

        const result = await DatabaseHandler.query(db, resolvedSql);
        queryResult.value = result.data ?? [];

        const tableColumnMapResult = await DatabaseHandler.getTableColumnMap(db);
        const variables = SqlHandler.GetSqlVariableNames(resolvedSql, tableColumnMapResult.data ?? {}, queryResult.value);
        sqlVariables.value = variables;
        console.log(`SQL Variables:`, variables);
    } catch (e) {
        console.error(e);
    }
});

watch(editedSql, async (newSql) => {
    const db = systemsStore.selectedSystem?.database?.sqlJsDatabase;
    if (db && newSql) {
        const result = await DatabaseHandler.isSqlValid(db, newSql);
        isEditedSqlValid.value = result.result === OperationResultType.SUCCESS;

        if (isEditedSqlValid.value) {
            try {
                const tableColumnMapResult = await DatabaseHandler.getTableColumnMap(db);
                const result: QueryExecResult[] = (await DatabaseHandler.query(db, newSql)).data ?? [];
                queryResult.value = result;

                const variables = SqlHandler.GetSqlVariableNames(newSql, tableColumnMapResult.data ?? {}, result);
                sqlVariableNames.value = variables.map(v => v.variableAsName);

                // craft variables
                const newSqlVariables: Record<string, VariableType[]> = {};

                for (let i = 0; i < variables.length; i++) {
                    const variable = variables[i];
                    if (!variable) continue;

                    const variableName = variable.variableAsName;
                    const variableType = variable.columnType;

                    if (!queryResult.value[0]) continue;
                    const rawValues = queryResult.value[0].values.map(row => row[i]);
                    let variableResult: VariableType[] = [];

                    switch (variableType) {
                        case ColumnType.INTEGER:
                        case ColumnType.REAL:
                            variableResult = rawValues.map(v => Number(v));
                            break;
                        case ColumnType.DATE:
                            variableResult = rawValues.map(v => new Date(String(v)));
                            break;
                        case ColumnType.TEXT:
                        default:
                            variableResult = rawValues.map(v => String(v));
                            break;
                    }

                    newSqlVariables[variableName] = variableResult;
                }

                componentVariables.value.sqlVariables = newSqlVariables;

                console.log(`SQL Variables[${sqlVariableNames.value.length}]:`, sqlVariableNames.value);
            } catch (e) {
                console.error(e);
                sqlVariableNames.value = [];
            }
        } else {
            sqlVariableNames.value = [];
        }
    } else {
        isEditedSqlValid.value = true;
        sqlVariableNames.value = [];
    }
}, { immediate: true });


onUnmounted(() => removeStyle());
watch(() => props.component.css, (css) => applyStyle(css));
watch(componentVariables, () => applyStyle(props.component.css), { deep: true });
</script>

<style scoped>
@keyframes glow-yellow {

    0%,
    100% {
        background-color: #ffd057;
        box-shadow: 0 0 2px rgba(255, 208, 87, 0.4);
    }

    50% {
        background-color: #ffda73;
        box-shadow: 0 0 16px rgba(255, 208, 87, 0.9);
    }
}

@keyframes glow-orange {

    0%,
    100% {
        background-color: #f97316;
        box-shadow: 0 0 0 2px #f97316, 0 0 2px rgba(249, 115, 22, 0.4);
    }

    50% {
        background-color: #fb8633;
        box-shadow: 0 0 0 2px #f97316, 0 0 18px rgba(249, 115, 22, 0.9);
    }
}

@keyframes glow-border {

    0%,
    100% {
        box-shadow: 0 0 0 2px #f97316, 0 0 2px rgba(249, 115, 22, 0.4);
    }

    50% {
        box-shadow: 0 0 0 2px #f97316, 0 0 12px rgba(249, 115, 22, 0.8);
    }
}

.component-wrapper {
    width: fit-content;
    max-width: 100%;
    display: block;
    transition: all 0.2s ease-in-out;
    border-radius: 8px;
    cursor: default;
}

.highlight-active {
    padding: 8px;
    animation: glow-yellow 2s ease-in-out infinite;
}

.highlight-active.is-highlighted {
    animation: glow-orange 2s ease-in-out infinite;
}

.is-highlighted {
    animation: glow-border 2s ease-in-out infinite;
}

.content-container {
    position: relative;
    width: fit-content;
    cursor: initial;
}

.edit-icon {
    position: absolute;
    top: -12px;
    right: -12px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background-color: #fbc02d;
    border: 2px solid white;
    border-radius: 50%;
    cursor: pointer;
    color: #424242;
    z-index: 50;
    opacity: 1;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
    transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    transform: scale(1);
}

.edit-icon:hover {
    background-color: #f9a825;
    transform: scale(1.1);
}

.component-html {
    display: block;
}

.sql-var-card {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 8px 14px;
    border-radius: 10px;
    border: 1px solid rgba(14, 165, 233, 0.25);
    background: rgba(14, 165, 233, 0.06);
    min-width: 80px;
    transition: border-color 0.15s, background 0.15s;
}

.sql-var-card:hover {
    border-color: rgba(14, 165, 233, 0.5);
    background: rgba(14, 165, 233, 0.1);
}

.sql-var-name {
    font-size: 0.7rem;
    font-weight: 600;
    color: #0ea5e9;
    opacity: 0.8;
}

.sql-var-value {
    font-size: 0.95rem;
    font-weight: 600;
    color: #1e293b !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 220px;
}

.js-var-card {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 8px 14px;
    border-radius: 10px;
    border: 1px solid rgba(16, 185, 129, 0.25);
    background: rgba(16, 185, 129, 0.06);
    min-width: 80px;
    transition: border-color 0.15s, background 0.15s;
}

.js-var-card:hover {
    border-color: rgba(16, 185, 129, 0.5);
    background: rgba(16, 185, 129, 0.1);
}

.js-var-name {
    font-size: 0.7rem;
    font-weight: 600;
    color: #10b981;
    opacity: 0.8;
}

.js-var-value {
    font-size: 0.95rem;
    font-weight: 600;
    color: #1e293b !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 220px;
}

.general-var-card {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 8px 14px;
    border-radius: 10px;
    border: 1px solid rgba(99, 102, 241, 0.25);
    background: rgba(99, 102, 241, 0.06);
    min-width: 80px;
    transition: border-color 0.15s, background 0.15s;
}

.general-var-card:hover {
    border-color: rgba(99, 102, 241, 0.5);
    background: rgba(99, 102, 241, 0.1);
}

.general-var-name {
    font-size: 0.7rem;
    font-weight: 600;
    color: #6366f1;
    opacity: 0.8;
}

.general-var-value {
    font-size: 0.95rem;
    font-weight: 600;
    color: #1e293b !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 220px;
}
</style>