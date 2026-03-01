import { CsLanguage } from "~/language/CsLangauge"
import { EnLanguage } from "~/language/EnLanguage"
import type { Language } from "~/language/Language"

/**
 * Store for global settings that are not specific to any system. These settings can be used across the entire application and can be overridden by system-specific settings if needed.
 */
export const useGlobalSettingsStore = defineStore('globalSettings', () => {
  
    /**
     * Langauage which is used across the application, but each system can have its own language settings. This is used for the global settings, which are not system specific.
     * When a system is created it uses this language as the default language, but it can be changed later on.
     */
    const globalLanguage = ref<Language>(new EnLanguage)

    /**
     * Whether the task menu is displayed as a sidebar or not. If not then it is displayed as a drawer after clicking on the tasks icon.
     */
    const taskMenuDisplayedAsSidebar = ref(false)

    /**
     * List of all available languages in the application.
     */
    const languages: Language[] = [
        new EnLanguage(),
        new CsLanguage()
    ]


    return {
        globalLanguage,
        taskMenuDisplayedAsSidebar,
        languages
    }

})