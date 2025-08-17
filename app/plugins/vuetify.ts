import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import colors from 'vuetify/util/colors'
import { createVuetify } from 'vuetify'

import { defineNuxtPlugin } from '#app'

const theme = {
    defaultTheme: 'system',
    themes: {
        light: {
            dark: false,
            colors: {
                primary: colors.teal.base,       // プライマリ: 青緑
                secondary: colors.purple.base,   // セカンダリ: 紫
                accent: colors.amber.base,       // 強調色
                background: colors.grey.lighten5,
                surface: colors.grey.lighten4,
                error: colors.red.accent3,
                info: colors.blue.base,
                success: colors.green.base,
                warning: colors.orange.base,
                'main-color': colors.grey.darken4
            }
        },
        dark: {
            dark: true,
            colors: {
                primary: colors.teal.lighten2,   // ダーク用に少し明るい青緑
                secondary: colors.purple.lighten2,
                accent: colors.amber.lighten2,
                background: colors.grey.darken4,
                surface: colors.grey.darken3,
                error: colors.red.accent2,
                info: colors.blue.lighten1,
                success: colors.green.lighten1,
                warning: colors.orange.lighten1,
                'main-color': colors.grey.lighten5
            }
        }
    }
}

export default defineNuxtPlugin((nuxtApp) => {
    const vuetify = createVuetify({
        components,
        directives,
        ssr: true,
        theme,
        icons: {
            defaultSet: 'mdi',
            aliases,
            sets: {
                mdi,
            },
        },
    })

    nuxtApp.vueApp.use(vuetify)
})