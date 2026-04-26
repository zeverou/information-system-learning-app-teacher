export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const globalSettings = useGlobalSettingsStore()

  globalSettings.teacherMode = String(config.public.appMode ?? '').trim().toUpperCase() === 'TEACHER'
})
