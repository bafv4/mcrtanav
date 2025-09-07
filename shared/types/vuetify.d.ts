import 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

// Vuetifyの型補完が効かない場合に追加
declare module 'vuetify' {
    export interface IconOptions {
        defaultSet: string
        aliases: typeof aliases
        sets: {
            mdi: typeof mdi
        }
    }
}