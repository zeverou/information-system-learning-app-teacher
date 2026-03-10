<template>
  <div @click="handleClick"
       :class="['component-wrapper', { 'highlight-active': highlightStore.isHighlightActive, 'is-highlighted': highlightStore.isHighlightActive && highlightStore.selectedHighlightedComponentsIds.has(props.component.id) }]">
    <div :class="['content-container', { 'edit-mode': isEditEnabled }]">

            <span v-if="isEditEnabled" class="edit-icon" @click.stop="handleEdit">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                    <path d="m15 5 4 4"/>
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
          <UButton @click="saveEdit" color="sky" :disabled="!isEditedSqlValid">Save Changes</UButton>
        </div>
      </template>
      <template #body>
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-2 justify-end -mt-2">
            <UButton icon="i-lucide-minus" color="neutral" variant="ghost"
                     @click="sizeMultiplier -= 0.05"/>
            <span class="text-xs text-gray-500 font-medium w-10 text-center">{{
                Math.round(sizeMultiplier *
                    100)
              }}%</span>
            <UButton icon="i-lucide-plus" color="neutral" variant="ghost" @click="sizeMultiplier += 0.05"/>
          </div>

          <div class="flex flex-row gap-2 w-full items-center">
            <USelect
                id="query-select"
                v-model="selectedSqlQuery"
                :items="sqlQueryNames"
                placeholder="Vyberte SQL dotaz"
                class="flex-1"
                :disabled="Object.keys(props.component.sql ?? {}).length === 1"
            />
            <UBadge color="neutral" variant="subtle" size="md">{{ sqlQueryNames.length }}</UBadge>
            <UButton icon="i-lucide-plus" @click="addQuery" size="md" class="aspect-square shrink-0" />
            <UButton icon="i-lucide-minus" @click="removeQuery" size="md" color="red" variant="subtle" class="aspect-square shrink-0" :disabled="sqlQueryNames.length <= 1" />
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 w-full">
            <CodeBlock v-model:code="editedHtml" language="html" label="HTML" height="400px"
                       :correct="undefined" :size-multiplier="sizeMultiplier"/>
            <CodeBlock v-model:code="editedCss" language="css" label="CSS" height="400px"
                       :correct="undefined" :size-multiplier="sizeMultiplier"/>
            <CodeBlock v-model:code="editedJs" language="typescript" label="JS" height="400px"
                       :correct="undefined" :protected-prefix="sqlVarsHeader || undefined"
                       :size-multiplier="sizeMultiplier"/>
            <CodeBlock v-model:code="editedSql" language="sql" label="SQL" height="400px"
                       :correct="isEditedSqlValid" :size-multiplier="sizeMultiplier"/>
          </div>

          <USeparator/>

          <div v-if="generalVariableNames.length > 0" class="mt-2 text-left">
            <p
                class="text-xs text-left font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
              Available General variables
            </p>
            <div class="flex flex-wrap gap-2 text-left">
              <div v-for="name in generalVariableNames" :key="name" class="general-var-card text-left">
                <span class="general-var-name">{{ name }}</span>
                <span class="general-var-value">{{
                    formatVariablesPreview(name, componentVariables.generalVariables)
                  }}</span>
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
              <UIcon name="i-lucide-box" class="w-5 h-5 text-gray-400"/>
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
                <span class="sql-var-value">{{
                    formatVariablesPreview(name, componentVariables.sqlVariables)
                  }}</span>
              </div>
            </div>
          </div>
          <div v-else class="mt-2">
            <p class="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-2">
              Available SQL variables
            </p>
            <div
                class="flex flex-row items-center gap-2 py-2 px-4 w-fit bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
              <UIcon name="i-lucide-database-zap" class="w-5 h-5 text-gray-400"/>
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
                <span class="js-var-value">{{
                    formatVariablesPreview(name, componentVariables.jsVariables)
                  }}</span>
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
              <UIcon name="i-lucide-code-2" class="w-5 h-5 text-gray-400"/>
              <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">No valid JS variables found
              </p>
            </div>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type {QueryExecResult} from 'sql.js';
import {ref, onMounted, onUnmounted, watch, computed} from 'vue';
import {SqlHandler} from '~/core/SqlHandler';
import {JsHandler} from '~/core/JsHandler';
import {HtmlHandler} from '~/core/HtmlHandler';
import {Component as SystemComponent} from '~/model/Component';
import {ComponentVariables, Variable} from '~/model/ComponentVariables';
import {useSystemsStore} from '~/stores/systemsStore';
import {useHighlightStore} from '~/stores/highlightStore';
import {DatabaseHandler} from '~/utils/DatabaseHandler';
import {OperationResultType} from '~/utils/OperationResultType';
import {TableMap} from '~/core/TableMap';
import {ColumnType} from '~/utils/ColumnType';
import type {VariableType} from '~/model/types/VariableType';

const props = defineProps<{
  component: SystemComponent,
  generalVariables?: Variable[]
}>()

const systemsStore = useSystemsStore();
const highlightStore = useHighlightStore();
const styleId = `component-style-${props.component.id}`;


const appliedCSS: ComputedRef<string> = computed(() => HtmlHandler.ReplaceHtmlForVariables(componentVariables.value, props.component.css));
const appliedHtml: ComputedRef<string> = computed(() => HtmlHandler.ReplaceHtmlForVariables(componentVariables.value, props.component.html));


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
const sqlVariableNames = computed(() => componentVariables.value.sqlVariables.map(v => v.name));
const jsVariableNames = computed(() => componentVariables.value.jsVariables.map(v => v.name));
const generalVariableNames = computed(() => componentVariables.value.generalVariables.map(v => v.name));
const sizeMultiplier = ref(1);
const selectedSqlQuery = ref<string>('');
const sqlQueryNames = computed(() => Object.keys(props.component.sql ?? {}))
let db = undefined;

/** Read-only JS constants generated from the current SQL query results.
 *  Shown as a protected header in the JS editor so user code can reference them. */
const sqlVarsHeader = computed<string>(() => {
  const vars = componentVariables.value.sqlVariables
  if (!vars || vars.length === 0) return ''
  return JsHandler.getSqlVariablesIntoJs(vars)
})

function formatVariablesPreview(name: string, variables: Variable[]): string {
  const values = variables?.find(v => v.name === name)?.variable;
  if (!values && values !== 0 && values !== false as any) return '—';
  if (Array.isArray(values)) {
    const preview = values.slice(0, 5).map(v => String(v)).join(', ');
    return values.length > 5 ? `${preview}, … (${values.length} total)` : preview;
  }
  return String(values);
}

function addQuery() {
  const sqlRecord = props.component.sql ?? {};
  const newQueryName = `query${Object.keys(sqlRecord).length + 1}`;
  props.component.sql[newQueryName] = '';
  selectedSqlQuery.value = newQueryName;
}

function removeQuery() {
  const current = selectedSqlQuery.value;
  if (!current || sqlQueryNames.value.length <= 1) return;
  delete props.component.sql[current];
  selectedSqlQuery.value = Object.keys(props.component.sql).sort((a, b) => a.localeCompare(b))[0] || '';
}

/**
 * Saves the edited component code back to the component object and updates the system in the store.
 */
async function saveEdit() {

  // saving the edited component code to the component object
  props.component.html = editedHtml.value;
  props.component.css = editedCss.value;
  props.component.js = editedJs.value;
  props.component.sql[selectedSqlQuery.value] = editedSql.value;

  // Explicitly update component variables on save
  // TODO: is this needed?
  // if (editedJs.value) {
  //     try { componentVariables.value.jsVariables = JsHandler.getJsVariables(editedJs.value); } catch (e) { }
  // }

  isEditModalOpened.value = false;

  if (systemsStore.selectedSystem) {
    await systemsStore.updateSystem(systemsStore.selectedSystem);
  }
}

/**
 * Edit (pencil) icon click action, opens the edit modal and initializes the code editors with the current component code.
 */
function handleEdit() {
  editedHtml.value = props.component.html;
  editedCss.value = props.component.css;
  editedJs.value = props.component.js;
  editedSql.value = props.component.sql[selectedSqlQuery.value] || '';

  // turns on visibility of the modal
  isEditModalOpened.value = true;
}

/**
 * Closes the edit modal without saving changes.
 */
function closeEdit() {
  isEditModalOpened.value = false;
}

async function populateSqlVariables(sqlRecord: Record<string, string>) {
  const tableMap = await DatabaseHandler.getTableColumnMap(db);

  for (const [queryName, sql] of Object.entries(sqlRecord)) {
    const result: QueryExecResult[] = (await DatabaseHandler.query(db, sql)).data ?? [];
    const values = result.length > 0 ? Object.values(result[0].values) : [];

    const vars: TableMap[] = SqlHandler.GetSqlVariableNames(sql, tableMap.data ?? {}, result);

    if (vars === undefined || vars.length === 0) continue;
    sqlVariables.value = [...sqlVariables.value, ...vars];

    console.log("VALUES:", values)

    const pushIfUnique = (variable: Variable) => {
      if (!componentVariables.value.sqlVariables.some(v => v.name === variable.name)) {
        componentVariables.value.sqlVariables.push(variable);
      }
    };

    if (values.length == 1) {
      for (let i = 0; i < vars.length; i++) {
        const varType: VariableType = TableMap.getVariableTypeFromColumnType(vars[i].columnType) || 'unknown';
        const rawValue = values[0][i];
        const value: VariableType = varType instanceof Date && rawValue !== null
          ? new Date(rawValue as string)
          : (rawValue as VariableType) ?? varType;
        pushIfUnique(new Variable(vars[i].variableAsName, value));
      }
    } else if (values.length > 1) {
      for (let i = 0; i < vars.length; i++) {
        const varType: VariableType = TableMap.getVariableTypeFromColumnType(vars[i].columnType) || 'unknown';
        const columnValues: VariableType[] = values.map(row => {
          const rawValue = row[i];
          return varType instanceof Date && rawValue !== null
            ? new Date(rawValue as string)
            : (rawValue as VariableType) ?? varType;
        });
        pushIfUnique(new Variable(vars[i].variableAsName, columnValues));
      }
    }
  }
}

function handleClick() {
    
    // if highlight mode as active we will not execute click action
    if (highlightStore.isHighlightActive) {
        highlightStore.selectHighlightedComponent(props.component.id);
        return;
    } else {
        // execute js code on click if exists
        // TODO: otázka zda replacovat, anebo ne
        if (props.component.js_click) {
            try {
                eval(props.component.js_click);
            } catch (e) {
                console.error('Error executing click JS code:', e);
            }
        } else {
            console.log('No click JS code to execute for this component.');
        }

        // execute all sql
        // TODO: otázka zda replacovat, anebo ne
        if (props.component.sql_click) {
            try {
                for (const sql of Object.values(props.component.sql_click)) {
                    DatabaseHandler.query(db, sql);
                }
            } catch (e) {
                console.error('Error executing click SQL code:', e);
            }
        } else {
            console.log('No click SQL code to execute for this component.');
        }
    }
}

/**
 * Applies the given CSS styles to the document head, replacing any variable placeholders with their actual values.
 * @param css
 */
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

// watcher - css change when componentVariables change
watch(componentVariables, () => applyStyle(props.component.css), {deep: true});

// watcher - general variables
watch(() => props.generalVariables, (newVars) => {
  componentVariables.value.generalVariables = newVars ?? [];
}, {deep: true, immediate: true});

// watcher - edited JS code
watch(() => editedJs.value, (newJs) => {
  if (!newJs) {
    componentVariables.value.jsVariables = [];
    return;
  }

  try {
    const fullCode = sqlVarsHeader.value ? `${sqlVarsHeader.value}\n${newJs}` : newJs;
    componentVariables.value.jsVariables = JsHandler.getJsVariables(fullCode, newJs);
  } catch (e) {
    console.error('Error parsing JS variables:', e);
    componentVariables.value.jsVariables = [];
  }
}, {immediate: true});

// watcher - edited SQL code
watch(() => editedSql.value, async (newSql) => {
  if (!db) return;

  // merge the currently edited SQL into a temp record
  const tempSqlRecord: Record<string, string> = {
    ...props.component.sql,
    [selectedSqlQuery.value]: newSql
  };

  // reset and re-populate sql variables
  componentVariables.value.sqlVariables = [];
  sqlVariables.value = [];

  const replacedSql = SqlHandler.ReplaceSqlForVariablesInRecord(componentVariables.value, tempSqlRecord);
  await populateSqlVariables(replacedSql);
});

// watcher - when the selected SQL query changes, update the editedSql to show the code of the newly selected query
watch(selectedSqlQuery, (newQuery) => {
  editedSql.value = props.component.sql[newQuery] || '';
});


onMounted(async () => {
  db = systemsStore.selectedSystem?.database?.sqlJsDatabase ?? undefined;

  // preselect sql query
  selectedSqlQuery.value = Object.keys(props.component.sql ?? {})
      .sort((a, b) => a.localeCompare(b))[0] || '';

  // apply styles on mount
  applyStyle(props.component.css);

  // populate general variables
  if (props.generalVariables) {
    componentVariables.value.generalVariables = props.generalVariables;
  }

  // populate JS variables from component JS code
  if (props.component.js) {
    try {
      componentVariables.value.jsVariables = JsHandler.getJsVariables(props.component.js);
    } catch (e) {
      console.error('Error parsing JS variables:', e);
    }
  }

  // populate SQL variables from component SQL code
  if (db && props.component.sql) {
    const replacedSql: Record<string, string> = SqlHandler.ReplaceSqlForVariablesInRecord(componentVariables.value, props.component.sql);
    await populateSqlVariables(replacedSql);
  }
  console.log('Initial SQL variables:', sqlVariables.value);


})

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