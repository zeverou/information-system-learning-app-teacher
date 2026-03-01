<template>
    <UModal :title="t('upload_system')">
        <UButton class="add-new-system-button" icon="i-lucide-plus-circle" size="lg" color="teacher">
            {{ t('add_new_system') }}
        </UButton>

        <template #body>
            <UFileUpload v-model="selectedFile" accept=".zip" :label="t('upload_system_zip')" icon="i-lucide-upload"
                class="w-full min-h-48" />
        </template>

        <template #footer="{ close }">
            <UButton color="teacher" icon="i-lucide-upload" :disabled="!selectedFile" :loading="loading"
                @click="onUpload(close)">
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

/* 3. Context hooks */
const { t } = useI18n()

/* 8. Local state */
const selectedFile = ref<File | null>(null)
const loader = ref<SystemZipLoader | null>(null)
const loading = ref(false)

/* 10. Watchers */
watch(selectedFile, async (file) => {
    if (!file) {
        loader.value = null
        return
    }
    const result: Operation<SystemZipLoader | null> = await SystemZipLoader.create(file)
    if (result.result === OperationResultType.SUCCESS && result.data) {
        loader.value = result.data
    } else {
        console.error(result.message)
        loader.value = null
    }
})

watch(loader, () => {
    if (!loader.value) {
        console.error('Failed to load ZIP file.')
    } else {
        loader.value.printDebugInfo()
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
        selectedFile.value = null
        close()
    } finally {
        loading.value = false
    }
}
</script>