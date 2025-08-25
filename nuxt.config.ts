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
    'nuxt-auth-utils',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    }
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
  runtimeConfig: {
    // サーバー側でのみ利用
    discordBotToken: process.env.DISCORD_BOT_TOKEN,
    targetGuildId: process.env.TARGET_GUILD_ID,
    allowedRoleIds: process.env.ALLOWED_ROLE_IDS?.split(',') ?? [],
    redirectUri: process.env.REDIRECT_URI,

    // クライアントでも使いたい変数は public に
    public: {
      discordRedirectUri: process.env.DISCORD_REDIRECT_URI,
    },
  },
})
