// https://nuxt.com/docs/api/configuration/nuxt-config
import fs from 'node:fs'
import path from 'node:path'

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
      console.log(`[systems-manifest] Found ${systems.length} system(s):`, systems)
    }
  }
}

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
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
