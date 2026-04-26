export default defineNuxtPlugin(() => {
  const globalSettings = useGlobalSettingsStore()

  globalSettings.syncTeacherModeFromRuntimeConfig()
})
