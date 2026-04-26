// https://nuxt.com/docs/api/configuration/nuxt-config
import fs from 'node:fs'
import path from 'node:path'

const loadPagesFrom = process.env.NUXT_PUBLIC_LOAD_PAGES_FROM ?? 'system'

function generateSystemsManifest() {
  return {
    name: 'generate-systems-manifest',
    buildStart() {
      const systemsDir = path.resolve(__dirname, 'public/systems')
      if (!fs.existsSync(systemsDir)) fs.mkdirSync(systemsDir, { recursive: true })
      const systems = fs.readdirSync(systemsDir, { withFileTypes: true })
        .filter(entry =>
          entry.isFile() && entry.name.endsWith('.zip') ||
          entry.isDirectory() && fs.existsSync(path.join(systemsDir, entry.name, 'config.json'))
        )
        .map(entry => entry.name)

      fs.writeFileSync(path.join(systemsDir, 'manifest.json'), JSON.stringify({ systems }, null, 2))
      //console.log(`[systems-manifest] Found ${systems.length} system(s):`, systems)
    }
  }
}

function isStaticSystemContentPage(file?: string) {
  if (!file) {
    return false
  }

  const normalizedFile = file.split(path.sep).join('/')

  return normalizedFile.includes('/app/pages/systems/[id]/')
    && !normalizedFile.endsWith('/app/pages/systems/[id]/[...path].vue')
    && !normalizedFile.endsWith('/app/pages/systems/[id]/database.vue')
    && !normalizedFile.endsWith('/app/pages/systems/[id]/designer.vue')
}

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  hooks: {
    'pages:extend'(pages) {
      if (String(loadPagesFrom).trim().toLowerCase() === 'directory') {
        return
      }

      function removeStaticSystemContentPages(routes: typeof pages) {
        for (let index = routes.length - 1; index >= 0; index--) {
          const route = routes[index]

          if (route.children) {
            removeStaticSystemContentPages(route.children)
          }

          if (isStaticSystemContentPage(route.file)) {
            routes.splice(index, 1)
          }
        }
      }

      removeStaticSystemContentPages(pages)
    },
  },
  runtimeConfig: {
    public: {
      appMode: process.env.NUXT_PUBLIC_APP_MODE ?? '',
      singleSystem: process.env.NUXT_PUBLIC_SINGLE_SYSTEM ?? 'true',
      loadComponentsFrom: process.env.NUXT_PUBLIC_LOAD_COMPONENTS_FROM ?? 'system',
      loadPagesFrom,
    },
  },
  colorMode: {
    preference: 'light',
    fallback: 'light',
  },
  vite: {
    plugins: [generateSystemsManifest()],
  },
  modules: ['@nuxt/ui', '@pinia/nuxt', '@nuxtjs/i18n', 'pinia-plugin-persistedstate/nuxt', '@nuxt/test-utils/module', '@nuxt/eslint'],
  piniaPluginPersistedstate: {
    storage: 'localStorage',
    debug: true,
  },
  css: ['./assets/css/main.css'],
  ssr: false,
  i18n: {
    locales: [
      {
        code: 'cs',
        iso: 'cs-CZ',
        file: 'cs.json',
        name: 'Čeština'
      },
      {
        code: 'en',
        iso: 'en-US',
        file: 'en.json',
        name: 'English'
      }
    ],
    defaultLocale: 'cs',
    langDir: 'locales/',
    strategy: 'no_prefix',
    detectBrowserLanguage: false
  },
  app: {
    // locally:
    // baseURL: './'
    baseURL: '/information-system-learning-app', 
  },
  ui: {
    theme: {
      colors: [
        'teacher',
        'student',
        'red',
        'yellow',
        'lime',
        'green',
        'sky',
        'blue',
        'violet',
        'orange',
      ]
    }
  }
})
