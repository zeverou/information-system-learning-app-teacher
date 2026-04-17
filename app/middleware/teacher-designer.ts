export default defineNuxtRouteMiddleware((to) => {
  const globalSettingsStore = useGlobalSettingsStore()

  if (globalSettingsStore.teacherMode) {
    return
  }

  const systemId = typeof to.params.id === 'string' ? to.params.id : null
  if (systemId) {
    return navigateTo(`/systems/${systemId}/dashboard`, { replace: true })
  }

  return navigateTo('/systems', { replace: true })
})
