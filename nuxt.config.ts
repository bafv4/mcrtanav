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
        config.plugins.push(vuetify(
          {
            autoImport: true,
            // styles: {
            //   configFile: '@assets/styles/settings.scss'
            // }
          }
        ))
      })
    }
  ],
  ssr: false,
  css: ['vuetify/styles'],
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
    redirectUri: process.env.REDIRECT_URI,

    // ロール別ID設定
    adminRoleId: process.env.ADMIN_ROLE_ID,
    rulesEditorRoleId: process.env.RULES_EDITOR_ROLE_ID,
    guideEditorRoleId: process.env.GUIDE_EDITOR_ROLE_ID,

    // エディタ機能用の環境変数
    githubToken: process.env.GITHUB_TOKEN,
    discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL,

    // クライアントでも使いたい変数は public に
    public: {
      discordRedirectUri: process.env.DISCORD_REDIRECT_URI,
    },
  },
})
