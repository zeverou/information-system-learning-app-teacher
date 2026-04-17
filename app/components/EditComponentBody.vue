<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-2 justify-end -mt-2">
      <UButton icon="i-lucide-minus" color="neutral" variant="ghost" @click="sizeMultiplier -= 0.05" />
      <span class="text-xs text-gray-500 font-medium w-10 text-center">{{ Math.round(sizeMultiplier * 100) }}%</span>
      <UButton icon="i-lucide-plus" color="neutral" variant="ghost" @click="sizeMultiplier += 0.05" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 w-full">
      <CodeBlock v-model:code="editedHtml" language="html" label="HTML" height="400px" :correct="undefined"
        :size-multiplier="sizeMultiplier" />
      <CodeBlock v-model:code="editedCss" language="css" label="CSS" height="400px" :correct="undefined"
        :size-multiplier="sizeMultiplier" />
      <CodeBlock v-model:code="editedJs" language="typescript" label="JS" height="400px" :correct="undefined"
        :protected-prefix="jsVarsHeader || undefined" :size-multiplier="sizeMultiplier" />
      <div class="flex flex-col gap-2">
        <div class="flex flex-row gap-2 w-full items-center">
          <USelect id="query-select" v-model="selectedSqlQuery" :items="sqlQueryNames" :placeholder="t('select_sql_query')"
            class="flex-1" :disabled="Object.keys(sqlRecord).length === 1" />
          <UBadge color="neutral" variant="subtle" size="md">{{ sqlQueryNames.length }}</UBadge>
          <UButton icon="i-lucide-plus" @click="addQuery" size="md" class="aspect-square shrink-0" />
          <UButton icon="i-lucide-minus" @click="removeQuery" size="md" color="red" variant="subtle"
            class="aspect-square shrink-0" :disabled="sqlQueryNames.length <= 1" />
        </div>
        <CodeBlock v-model:code="editedSql" language="sql" label="SQL" height="400px" :correct="isEditedSqlValid"
          :size-multiplier="sizeMultiplier" />
      </div>
    </div>

    <USeparator :label="t('click_actions')" />

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ t('js_click_action') }}</span>
          <UButton v-if="!editedJsClick" icon="i-lucide-plus" size="xs" variant="ghost" :label="t('add_action')"
            @click="editedJsClick = '// click logic here'" />
          <UButton v-else icon="i-lucide-trash-2" size="xs" variant="ghost" color="red" @click="editedJsClick = ''" />
        </div>

        <CodeBlock v-if="editedJsClick" v-model:code="editedJsClick" language="typescript" height="200px"
          label="JS Click" :correct="undefined" :size-multiplier="sizeMultiplier" />
        <div v-else
          class="flex flex-row items-center gap-2 py-4 px-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
          <UIcon name="i-lucide-mouse-pointer-2" class="w-5 h-5 text-gray-400" />
          <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">{{ t('no_js_click_action') }}</p>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider shrink-0">{{ t('sql_click_actions') }}</span>
          <USelect v-if="sqlClickQueryNames.length > 0" v-model="selectedSqlClickQuery" :items="sqlClickQueryNames"
            placeholder="Select SQL click query" size="xs" class="flex-1"
            :disabled="sqlClickQueryNames.length <= 1" />
          <div class="flex gap-1">
            <UButton icon="i-lucide-plus" size="xs" variant="ghost" @click="addClickQuery" />
            <UButton icon="i-lucide-trash-2" size="xs" variant="ghost" color="red" @click="removeClickQuery"
              :disabled="sqlClickQueryNames.length === 0" />
          </div>
        </div>

        <div v-if="sqlClickQueryNames.length > 0" class="flex flex-col gap-2">
          <CodeBlock v-model:code="editedSqlClick" language="sql" height="200px" label="SQL Click"
            :size-multiplier="sizeMultiplier" />
        </div>
        <div v-else
          class="flex flex-row items-center gap-2 py-4 px-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
          <UIcon name="i-lucide-database-zap" class="w-5 h-5 text-gray-400" />
          <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">{{ t('no_sql_click_action') }}</p>
        </div>
      </div>
    </div>

    <USeparator />

    <div v-if="generalVariableNames.length > 0" class="mt-2 text-left">
      <p class="text-xs text-left font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">{{ t('available_general_variables') }}</p>
      <div class="flex flex-wrap gap-2 text-left">
        <div v-for="name in generalVariableNames" :key="name" class="general-var-card text-left">
          <span class="general-var-name">{{ name }}</span>
          <span class="general-var-value">{{ formatVariablesPreview(name, localVariables.generalVariables) }}</span>
        </div>
      </div>
    </div>

    <div v-if="sqlVariableNames.length > 0" class="mt-2">
      <p class="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-2">{{ t('available_sql_variables') }}</p>
      <div class="flex flex-wrap gap-2">
        <div v-for="name in sqlVariableNames" :key="name" class="sql-var-card">
          <span class="sql-var-name">{{ name }}</span>
          <span class="sql-var-value">{{ formatVariablesPreview(name, localVariables.sqlVariables) }}</span>
        </div>
      </div>
    </div>

    <div v-if="jsVariableNames.length > 0" class="mt-2">
      <p class="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">{{ t('available_js_variables') }}</p>
      <div class="flex flex-wrap gap-2">
        <div v-for="name in jsVariableNames" :key="name" class="js-var-card">
          <span class="js-var-name">{{ name }}</span>
          <span class="js-var-value">{{ formatVariablesPreview(name, localVariables.jsVariables) }}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { QueryExecResult } from 'sql.js';
import { ref, watch, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { SqlHandler } from '~/core/SqlHandler';
import { JsHandler } from '~/core/JsHandler';
import { Component as SystemComponent } from '~/model/Component';
import { ComponentVariables, Variable } from '~/model/ComponentVariables';
import { DatabaseHandler } from '~/utils/DatabaseHandler';
import { DatabaseWrapper } from '~/utils/DatabaseWrapper';
import { TableMap } from '~/core/TableMap';
import { useSystemsStore } from '~/stores/systemsStore';
import type { VariableType } from '~/model/types/VariableType';

const props = defineProps<{
  component: SystemComponent;
  variables?: ComponentVariables;
}>();

const { t } = useI18n();

const emit = defineEmits<{
  (e: 'validation-change', isValid: boolean): void;
}>();

const systemsStore = useSystemsStore();
const db = computed(() => systemsStore.selectedSystem?.database ?? undefined);

// Form state
const editedHtml = ref(props.component.html);
const editedCss = ref(props.component.css);
const editedJs = ref(props.component.js);
const editedSql = ref('');
const editedJsClick = ref(props.component.js_click || '');
const editedSqlClick = ref('');
const sizeMultiplier = ref(0.7);

const selectedSqlQuery = ref<string>('');
const selectedSqlClickQuery = ref<string>('');
const isEditedSqlValid = ref(true);

const localVariables = ref<ComponentVariables>(new ComponentVariables());
const sqlRecord = ref<Record<string, string>>({ ...(props.component.sql ?? {}) });
const sqlClickRecord = ref<Record<string, string>>({ ...(props.component.sql_click ?? {}) });

// Computed
const sqlQueryNames = computed(() => Object.keys(sqlRecord.value));
const sqlClickQueryNames = computed(() => Object.keys(sqlClickRecord.value));
const sqlVariableNames = computed(() => localVariables.value.sqlVariables.map(v => v.name));
const jsVariableNames = computed(() => localVariables.value.jsVariables.map(v => v.name));
const generalVariableNames = computed(() => localVariables.value.generalVariables.map(v => v.name));

const jsVarsHeader = computed<string>(() => {
  const vars = [...(localVariables.value.generalVariables ?? []), ...(localVariables.value.sqlVariables ?? [])];
  return vars.length === 0 ? '' : JsHandler.getVariablesIntoJs(vars);
});

// Watch validity and let parent wrapper know
watch(isEditedSqlValid, (valid) => emit('validation-change', valid), { immediate: true });

// Setup Initial state on mount
onMounted(() => {
  selectedSqlQuery.value = sqlQueryNames.value.sort((a, b) => a.localeCompare(b))[0] || '';
  editedSql.value = sqlRecord.value[selectedSqlQuery.value] || '';

  selectedSqlClickQuery.value = sqlClickQueryNames.value.sort((a, b) => a.localeCompare(b))[0] || '';
  editedSqlClick.value = sqlClickRecord.value[selectedSqlClickQuery.value] || '';

  const source = props.variables ?? props.component.variables;
  localVariables.value.generalVariables = [...source.generalVariables];
  localVariables.value.sqlVariables = [...source.sqlVariables];

  // Compute JS variables immediately so badges are visible without needing to type first
  if (editedJs.value) {
    try {
      const fullCode = jsVarsHeader.value ? `${jsVarsHeader.value}\n${editedJs.value}` : editedJs.value;
      localVariables.value.jsVariables = JsHandler.getJsVariables(fullCode, editedJs.value);
    } catch {
      localVariables.value.jsVariables = [...source.jsVariables];
    }
  } else {
    localVariables.value.jsVariables = [...source.jsVariables];
  }
});

// Watch JS changes
watch(editedJs, (newJs) => {
  if (!newJs) {
    localVariables.value.jsVariables = [];
    return;
  }
  try {
    const fullCode = jsVarsHeader.value ? `${jsVarsHeader.value}\n${newJs}` : newJs;
    localVariables.value.jsVariables = JsHandler.getJsVariables(fullCode, newJs);
  } catch (e) {
    localVariables.value.jsVariables = [];
  }
});

// Watch SQL changes
watch(editedSql, async (newSql) => {
  if (!db.value) return;
  sqlRecord.value[selectedSqlQuery.value] = newSql;
  localVariables.value.sqlVariables = [];

  const replacedSql = SqlHandler.ReplaceSqlForVariablesInRecord(localVariables.value, sqlRecord.value);
  await populateSqlVariables(replacedSql);
});

// Query switching
watch(selectedSqlQuery, (newQuery) => editedSql.value = sqlRecord.value[newQuery] || '');
watch(selectedSqlClickQuery, (newQuery) => editedSqlClick.value = sqlClickRecord.value[newQuery] || '');

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
  const newQueryName = `query${Object.keys(sqlRecord.value).length + 1}`;
  sqlRecord.value[newQueryName] = '';
  selectedSqlQuery.value = newQueryName;
}

function removeQuery() {
  const current = selectedSqlQuery.value;
  if (!current || sqlQueryNames.value.length <= 1) return;
  delete sqlRecord.value[current];
  selectedSqlQuery.value = Object.keys(sqlRecord.value).sort((a, b) => a.localeCompare(b))[0] || '';
}

function addClickQuery() {
  const newQueryName = `clickQuery${Object.keys(sqlClickRecord.value).length + 1}`;
  sqlClickRecord.value[newQueryName] = '';
  selectedSqlClickQuery.value = newQueryName;
  editedSqlClick.value = '';
}

function removeClickQuery() {
  const current = selectedSqlClickQuery.value;
  if (!current) return;
  delete sqlClickRecord.value[current];
  selectedSqlClickQuery.value = Object.keys(sqlClickRecord.value).sort((a, b) => a.localeCompare(b))[0] || '';
  editedSqlClick.value = sqlClickRecord.value[selectedSqlClickQuery.value] || '';
}

async function populateSqlVariables(queries: Record<string, string>) {
  const tableMap = await DatabaseHandler.getTableColumnMap(db.value?.sqlJsDatabase ?? null);

  for (const sql of Object.values(queries)) {
    const result: QueryExecResult[] = (await db.value!.query(sql)).data ?? [];
    const values = result.length > 0 ? Object.values(result[0].values) : [];
    const vars: TableMap[] = SqlHandler.GetSqlVariableNames(sql, tableMap.data ?? {}, result);

    if (!vars || vars.length === 0) continue;

    const pushIfUnique = (variable: Variable) => {
      if (!localVariables.value.sqlVariables.some(v => v.name === variable.name)) {
        localVariables.value.sqlVariables.push(variable);
      }
    };

    if (values.length == 1) {
      for (let i = 0; i < vars.length; i++) {
        const varType: VariableType = TableMap.getVariableTypeFromColumnType(vars[i].columnType) || 'unknown';
        const rawValue = values[0][i];
        const value: VariableType = varType instanceof Date && rawValue !== null ? new Date(rawValue as string) : (rawValue as VariableType) ?? varType;
        pushIfUnique(new Variable(vars[i].variableAsName, value));
      }
    } else if (values.length > 1) {
      for (let i = 0; i < vars.length; i++) {
        const varType: VariableType = TableMap.getVariableTypeFromColumnType(vars[i].columnType) || 'unknown';
        const columnValues: VariableType[] = values.map(row => {
          const rawValue = row[i];
          return varType instanceof Date && rawValue !== null ? new Date(rawValue as string) : (rawValue as VariableType) ?? varType;
        });
        pushIfUnique(new Variable(vars[i].variableAsName, columnValues));
      }
    }
  }
}

// EXPOSE data retrieval to the wrapper modal
defineExpose({
  getDraftData() {
    if (selectedSqlClickQuery.value) {
      sqlClickRecord.value[selectedSqlClickQuery.value] = editedSqlClick.value;
    }
    
    const updatedComponent = {
      ...props.component,
      html: editedHtml.value,
      css: editedCss.value,
      js: editedJs.value,
      sql: { ...sqlRecord.value },
      js_click: editedJsClick.value,
      sql_click: { ...sqlClickRecord.value }
    };

    return {
      updatedComponent: updatedComponent as SystemComponent,
      updatedVariables: localVariables.value
    };
  }
});
</script>

<style scoped>
.sql-var-card, .js-var-card, .general-var-card {
  display: flex; flex-direction: column; gap: 2px; padding: 8px 14px; border-radius: 10px;
  min-width: 80px; transition: border-color 0.15s, background 0.15s;
}
.sql-var-card { border: 1px solid rgba(14, 165, 233, 0.25); background: rgba(14, 165, 233, 0.06); }
.sql-var-card:hover { border-color: rgba(14, 165, 233, 0.5); background: rgba(14, 165, 233, 0.1); }
.sql-var-name { font-size: 0.7rem; font-weight: 600; color: #0ea5e9; opacity: 0.8; }
.sql-var-value { font-size: 0.95rem; font-weight: 600; color: #1e293b !important; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 220px; }

.js-var-card { border: 1px solid rgba(16, 185, 129, 0.25); background: rgba(16, 185, 129, 0.06); }
.js-var-card:hover { border-color: rgba(16, 185, 129, 0.5); background: rgba(16, 185, 129, 0.1); }
.js-var-name { font-size: 0.7rem; font-weight: 600; color: #10b981; opacity: 0.8; }
.js-var-value { font-size: 0.95rem; font-weight: 600; color: #1e293b !important; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 220px; }

.general-var-card { border: 1px solid rgba(99, 102, 241, 0.25); background: rgba(99, 102, 241, 0.06); }
.general-var-card:hover { border-color: rgba(99, 102, 241, 0.5); background: rgba(99, 102, 241, 0.1); }
.general-var-name { font-size: 0.7rem; font-weight: 600; color: #6366f1; opacity: 0.8; }
.general-var-value { font-size: 0.95rem; font-weight: 600; color: #1e293b !important; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 220px; }
</style>