import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    '@nuxt/image',
    '@nuxt/fonts',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],
  ssr: false,
  css: ['vuetify/styles', '@/assets/styles/main.scss', '@mdi/font/css/materialdesignicons.css'],
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  
  app: {
    head: {
      titleTemplate: '%s - マイクラRTAナビ',
    }
  },
})
