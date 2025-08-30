import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { aliases as fa_aliases, fa } from 'vuetify/iconsets/fa-svg'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import colors from 'vuetify/util/colors'
import { createVuetify } from 'vuetify'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

import { defineNuxtPlugin } from '#app'

const theme = {
    defaultTheme: 'system',
    themes: {
        light: {
            dark: false,
            colors: {
                primary: colors.deepPurple.base,       // プライマリ: 青緑
                secondary: colors.lightGreen.base,   // セカンダリ: 紫
                accent: colors.amber.base,       // 強調色
                background: colors.grey.lighten5,
                surface: '#F4F4F6',
                error: colors.red.accent3,
                info: colors.blue.base,
                success: colors.green.base,
                warning: colors.orange.base,
                'on-background': colors.grey.darken4
            }
        },
        dark: {
            dark: true,
            colors: {
                primary: colors.lightGreen.lighten2,   // ダーク用に少し明るい青緑
                secondary: colors.deepPurple.lighten2,
                accent: colors.amber.lighten2,
                background: colors.grey.darken4,
                surface: '#272729',
                error: colors.red.accent2,
                info: colors.blue.lighten1,
                success: colors.green.lighten1,
                warning: colors.orange.lighten1,
                'on-background': colors.grey.lighten5
            }
        }
    }
}

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon)
    library.add(fab)

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
                fa
            },
        },
    })

    nuxtApp.vueApp.use(vuetify)
})