export default defineNuxtRouteMiddleware(async (to) => {
  const config = useRuntimeConfig();
  const globalSettings = useGlobalSettingsStore();
  const systemsStore = useSystemsStore();
  const { pushFirstAvailablePage } = useAvailableSystemPages();
  globalSettings.syncTeacherModeFromRuntimeConfig();
  const singleSystem = String(config.public.singleSystem ?? 'true').trim().toLowerCase() !== 'false';

  // We only restrict navigation in Student Mode when singleSystem is true
  if (globalSettings.teacherMode || !singleSystem) {
    return;
  }

  // If the user tries to go to /systems or /systems/
  if (to.path === '/systems' || to.path === '/systems/') {
     const systemId = systemsStore.selectedSystemId;
     // Redirect back into the system if one is selected
     if (systemId) {
       const system = systemsStore.getSystemById(systemId);
       if (system) {
          return pushFirstAvailablePage(null, { replace: true });
       }
     }
  }
});
