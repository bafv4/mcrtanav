import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { defineNuxtPlugin } from '#app'
import 'vuetify/styles'

export default defineNuxtPlugin((nuxtApp) => {
    const vuetify = createVuetify({
        components,
        directives,
        ssr: true,
        theme: {
            defaultTheme: 'light',
        },
        defaults: {
            global: {
                style: {
                    'font-family': "'IBM Plex Sans JP', sans-serif",
                },
            },
        },
    })

    nuxtApp.vueApp.use(vuetify)
})