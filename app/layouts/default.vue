<template>
    <NuxtLoadingIndicator class="z-index: 1000;" :color="getIndColor" :height="2" />
    <v-app>
        <v-app-bar class="bar select-none" density="comfortable" elevation="2" app>
            <v-btn class="d-block position-absolute ml-4 d-md-none" size="medium" icon="mdi-menu" :ripple="false"
                variant="plain" @click="drawer = !drawer" />
            <v-container class="d-flex flex-column justify-start">
                <div class="d-flex w-100 ga-4 justify-end align-center">
                    <v-app-bar-title
                        class="d-flex align-center cursor-pointer text-subtitle-1 text-weight-bold justify-center justify-md-start h-100">
                        <pagemark to="/" />
                    </v-app-bar-title>

                    <v-chip prepend-icon="mdi-magnify" class="cursor-pointer" variant="tonal" density="comfortable"
                        @click="handleSearch" v-if="computeCanSearch">検索</v-chip>

                    <v-divider vertical class="d-none d-md-flex" />

                    <div class="d-none d-md-flex">
                        <r-btn :pages="pages" />
                    </div>

                    <div class="d-none d-md-flex" v-if="loggedIn">
                        <v-btn icon density="comfortable" @click="showUserDialog">
                            <v-avatar :image="user?.avatar" size="28" />
                        </v-btn>
                    </div>
                </div>
            </v-container>
        </v-app-bar>

        <v-main>
            <v-container>
                <v-navigation-drawer class="drawer d-block d-md-none" v-model="drawer" location="left" mobile app>
                    <v-container class="d-flex flex-column justify-start ga-2">
                        <r-btn :pages="pages" mobile />
                    </v-container>
                </v-navigation-drawer>

                <NuxtPage v-if="!error" />
                <slot v-else></slot>

                <auth-dialog />
                <!-- <search-dialog :category="getCategory()" /> -->
                 <search />
            </v-container>
        </v-main>

        <v-footer class="border-t-md border-dotted" color="background" style="flex-shrink: 1; flex-grow: 0;">
            <p class="text-caption mx-auto mt-2 mb-8">&copy;2025 MCSR Japan Community</p>
        </v-footer>
    </v-app>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify/lib/composables/theme.mjs';
import { pages } from '~/assets/data/pages';
const { user, loggedIn, clear } = useUserSession()
const { showAuthDialog, showUserDialog } = useAuthDialog()
// const { openSearchDialog } = useSearch()
const { openSearchDialog } = useSearchWithFuse()
const theme = useTheme()
const error = useError()
const route = useRoute()

const drawer = ref(false)
const modal = ref(false)
const getIndColor = computed(() => theme.current.value.colors.primary)
const computeCanSearch = computed(() => canSeach())

const canSeach = () => pages.find(p => p.route == getFirstSegment(route.path))?.search
const getCategory = () => getFirstSegment(route.path)

const handleSearch = () => {
    console.log('pressed button')
    if (canSeach()) {
        console.log('searchable')
        openSearchDialog(getFirstSegment(route.path).replace('/', ''))
    }
}

const logout = () => {
    modal.value = false
    clear()
    if (useRoute().meta.auth) {
        useRouter().push('/')
    }
}
</script>

<style lang="scss" scoped>
.bar {
    background-color: rgba(var(--v-theme-background), .85) !important;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
}

.drawer {
    background-color: rgba(var(--v-theme-background), .85) !important;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
}
</style>