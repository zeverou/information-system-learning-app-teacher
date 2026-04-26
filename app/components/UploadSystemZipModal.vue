<template>
    <UModal :title="t('upload_system')">
        <UButton class="add-new-system-button" icon="i-lucide-plus-circle" size="lg" color="teacher">
            {{ t('add_new_system') }}
        </UButton>

        <template #body>
            <UFileUpload v-model="selectedFile" accept=".zip" :label="t('upload_system_zip')" icon="i-lucide-upload"
                class="w-full min-h-48" />
            <div v-if="systemPreview" class="mt-4 space-y-1">
                <p class="font-semibold text-lg">{{ systemPreview.name }}</p>
                <p class="text-sm text-muted">{{ systemPreview.description }}</p>
            </div>
            <UAlert v-if="systemAlreadyExists" color="red" icon="i-lucide-alert-triangle"
                :title="t('system_already_exists')" class="mt-3" />
        </template>

        <template #footer="{ close }">
            <UButton color="teacher" icon="i-lucide-upload" :disabled="!selectedFile || systemAlreadyExists"
                :loading="loading" @click="onUpload(close)">
                {{ t('upload_system') }}
            </UButton>
            <UButton color="neutral" variant="outline" @click="close">{{ t('cancel') }}</UButton>
        </template>
    </UModal>
</template>

<script setup lang="ts">
/* 1. Imports */
import { ref, watch } from 'vue'
import { SystemZipLoader } from '~/utils/SystemZipLoader'
import { InformationSystem } from '~/model/InformationSystem'
import { useSystemsStore } from '~/stores/systemsStore'
import { getPageLoadSource } from '~/utils/pageLoadSource'

/* 3. Context hooks */
const { t } = useI18n()
const systemsStore = useSystemsStore()

/* 8. Local state */
const selectedFile = ref<File | null>(null)
const loader = ref<SystemZipLoader | null>(null)
const loading = ref(false)
const systemPreview = ref<{ name: string; description: string } | null>(null)
const systemAlreadyExists = ref(false)

/* 10. Watchers */
watch(selectedFile, async (file) => {
    if (!file) {
        loader.value = null
        systemPreview.value = null
        systemAlreadyExists.value = false
        return
    }
    const result: Operation<SystemZipLoader | null> = await SystemZipLoader.create(file);
    //console.log("ZIP OP STATUS: " + result.toString())
    if (result.result === OperationResultType.SUCCESS && result.data) {
        //console.log(":)")
        loader.value = result.data
        try {
            const config = JSON.parse(result.data.jsonConfigFileContent ?? '{}')
            systemPreview.value = { name: config.name ?? '', description: config.description ?? '' }
            systemAlreadyExists.value = systemsStore.systems.some(s => String(s.id) === String(config.id))
        } catch {
            systemPreview.value = null
            systemAlreadyExists.value = false
        }
    } else {
        console.error(result.message)
        loader.value = null
        systemPreview.value = null
        systemAlreadyExists.value = false
    }
})

/* 9. Methods */
/**
 * Handles the upload of the selected ZIP file.
 * @param close The function to close the modal after upload is complete.
 */
async function onUpload(close: () => void) {
    if (!selectedFile.value || !loader.value) return
    loading.value = true
    try {
        const filesContents: Record<string, string> = {
            'config.json': loader.value.jsonConfigFileContent ?? '',
            'system_components.json': loader.value.jsonComponentsContent ?? '',
            ...loader.value.csvFilesContent,
            ...loader.value.sqlFilesContent,
        }
        if (getPageLoadSource() === 'system') {
            Object.assign(filesContents, loader.value.vueFilesContent)
        }
        const loadResult = await InformationSystem.loadSystem(filesContents)
        if (loadResult.result === OperationResultType.SUCCESS && loadResult.data) {
            await systemsStore.addSystem(loadResult.data)
        } else {
            console.error(loadResult.message)
        }
        selectedFile.value = null
        close()
    } finally {
        loading.value = false
    }
}
</script>
