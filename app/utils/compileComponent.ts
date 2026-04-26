// utils/compileComponent.ts
import { parse, compileScript, compileTemplate, compileStyle } from '@vue/compiler-sfc'
import ts from 'typescript'
import * as Vue from 'vue'
import * as VueRouter from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSystemsStore } from '~/stores/systemsStore'
import { useSyncSystemId } from '~/composables/useSyncSystemId'
import { useSystemInputVariables } from '~/composables/useSystemInputVariables'
import { DatabaseWrapper } from '~/utils/DatabaseWrapper'
import { DatabaseHandler } from '~/utils/DatabaseHandler'
import { ComponentVariables, Variable } from '~/model/ComponentVariables'
import ComponentWrapper from '~/components/ComponentWrapper.vue'
import ModalContainer from '~/components/ModalContainer.vue'

const MODULE_MAP: Record<string, any> = {
    'vue': Vue,
    'vue-router': VueRouter,
    'vue-i18n': { useI18n },
    '~/stores/systemsStore': { useSystemsStore },
    '~/composables/useSyncSystemId': { useSyncSystemId },
    '~/composables/useSystemInputVariables': { useSystemInputVariables },
    '~/utils/DatabaseWrapper': { DatabaseWrapper },
    '~/utils/DatabaseHandler': { DatabaseHandler },
    '~/model/ComponentVariables': { ComponentVariables, Variable },
    '~/components/ComponentWrapper.vue': { default: ComponentWrapper },
    '~/components/ModalContainer.vue': { default: ModalContainer },
}

function stripImports(code: string): string {
    return code
        .replace(/^import\s+.*?from\s+['"][^'"]+['"]\s*;?\s*$/gm, '')
        .replace(/^import\s+['"][^'"]+['"]\s*;?\s*$/gm, '')
        .replace(/^export\s+/gm, '')
}

export async function compileSFC(source: string, id: string): Promise<any> {

    console.log('Compiling component with id:', id)

    const { descriptor } = parse(source)

    const compiledScript = compileScript(descriptor, {
        id,
        genDefaultAs: '__comp__',
    })

    const hasScoped = descriptor.styles.some(s => s.scoped)

    const compiledTemplate = compileTemplate({
        source: descriptor.template!.content,
        filename: `${id}.vue`,
        id,
        scoped: hasScoped,
        compilerOptions: {
            bindingMetadata: compiledScript.bindings,
        },
    })

    for (const style of descriptor.styles) {
        const compiled = compileStyle({
            source: style.content,
            filename: `${id}.vue`,
            id,
            scoped: style.scoped ?? false,
        })
        const existing = document.querySelector(`style[data-comp-id="${id}"]`)
        if (!existing) {
            const el = document.createElement('style')
            el.setAttribute('data-comp-id', id)
            el.textContent = compiled.code
            document.head.appendChild(el)
        }
    }

    const strippedScript = stripImports(compiledScript.content)
    const strippedTemplate = stripImports(compiledTemplate.code)

    const moduleCode = `
        const { computed, ref, reactive, watch, watchEffect, onMounted, onUnmounted, toRef, toRefs, nextTick,
                defineComponent: _defineComponent,
                withAsyncContext: _withAsyncContext,
                resolveComponent: _resolveComponent,
                resolveDirective: _resolveDirective,
                createVNode: _createVNode,
                createTextVNode: _createTextVNode,
                createCommentVNode: _createCommentVNode,
                createElementVNode: _createElementVNode,
                openBlock: _openBlock,
                createElementBlock: _createElementBlock,
                createBlock: _createBlock,
                Fragment: _Fragment,
                renderList: _renderList,
                renderSlot: _renderSlot,
                withCtx: _withCtx,
                withKeys: _withKeys,
                withModifiers: _withModifiers,
                toDisplayString: _toDisplayString,
                normalizeClass: _normalizeClass,
                normalizeStyle: _normalizeStyle,
                normalizeProps: _normalizeProps,
                guardReactiveProps: _guardReactiveProps,
                mergeProps: _mergeProps,
                unref: _unref,
                vModelText: _vModelText,
                vModelSelect: _vModelSelect,
                vModelCheckbox: _vModelCheckbox,
                withDirectives: _withDirectives,
                vShow: _vShow
        } = __modules__['vue']
        const { useRoute, useRouter } = __modules__['vue-router']
        const { useI18n } = __modules__['vue-i18n']
        const { useSystemsStore } = __modules__['~/stores/systemsStore']
        const { useSyncSystemId } = __modules__['~/composables/useSyncSystemId']
        const { useSystemInputVariables } = __modules__['~/composables/useSystemInputVariables']
        const { DatabaseWrapper } = __modules__['~/utils/DatabaseWrapper']
        const { DatabaseHandler } = __modules__['~/utils/DatabaseHandler']
        const { ComponentVariables, Variable } = __modules__['~/model/ComponentVariables']
        const ComponentWrapper = __modules__['~/components/ComponentWrapper.vue'].default
        const ModalContainer = __modules__['~/components/ModalContainer.vue'].default

        ${strippedScript}

        __comp__.components = { ComponentWrapper, ModalContainer }

        ${strippedTemplate}
        __comp__.render = render
        return __comp__
    `

    const jsModuleCode = ts.transpileModule(moduleCode, {
        compilerOptions: {
            target: ts.ScriptTarget.ES2020,
            module: ts.ModuleKind.None,
        },
    }).outputText

    const factory = new Function('__modules__', jsModuleCode)
    return factory(MODULE_MAP)
}
