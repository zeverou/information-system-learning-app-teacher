import {
  availableVisiblePages,
  systemVisiblePages,
  systemPageRouteFromPath,
  systemAllowsPageForTaskContext,
} from '~/utils/taskPageVisibility'

export default defineNuxtRouteMiddleware((to) => {
  const systemId = typeof to.params.id === 'string' ? to.params.id : null

  if (!systemId) {
    return
  }

  const systemsStore = useSystemsStore()
  const globalSettings = useGlobalSettingsStore()
  const system = systemsStore.getSystemById(systemId)

  if (!system) {
    return
  }

  const pageRoute = systemPageRouteFromPath(to.path, systemId)
  const systemPage = systemVisiblePages(system).find(page => page.route === pageRoute)

  if (!systemPage) {
    return
  }

  const selectedTask = globalSettings.selectedTaskId
    ? system.tasks.find(task => task.id === globalSettings.selectedTaskId)
    : null

  if (systemAllowsPageForTaskContext(system, selectedTask, systemPage.route)) {
    return
  }

  const fallbackPage = availableVisiblePages(system, selectedTask)[0]

  if (fallbackPage) {
    return navigateTo(`/systems/${systemId}${fallbackPage.route}`, { replace: true })
  }

  return abortNavigation()
})
