<template>
    <v-app>
        <v-app-bar class="bar select-none" density="comfortable" elevation="2" app>
            <v-btn class="d-block position-absolute ml-4 d-md-none" size="medium" icon="mdi-menu" :ripple="false"
                variant="plain" @click="drawer = !drawer" />
            <v-container class="d-flex ga-4 justify-end align-center">

                <v-app-bar-title
                    class="d-flex align-center cursor-pointer text-subtitle-1 text-weight-bold justify-center justify-md-start h-100">
                    <pagemark to="/" />
                </v-app-bar-title>

                <v-chip prepend-icon="mdi-magnify" class="cursor-pointer" variant="tonal" density="comfortable" @click=""
                    v-if="pages.find(p => p.route == getFirstSegment($route.path))?.search">検索</v-chip>

                <v-divider vertical class="d-none d-md-flex" />

                <div class="d-none d-md-flex">
                    <r-btn :pages="pages" />
                </div>
            </v-container>
        </v-app-bar>

        <v-navigation-drawer class="drawer d-block d-md-none" v-model="drawer" app>
            <v-container class="d-flex flex-column justify-start ga-2">
                <r-btn :pages="pages" mobile />
            </v-container>
        </v-navigation-drawer>

        <v-container class="mt-12 mb-8">
            <NuxtPage v-if="!error" />
            <slot v-else></slot>
        </v-container>

        <v-footer class="border-t-md border-dotted" color="background" style="flex-shrink: 1; flex-grow: 0;">
            <p class="text-caption mx-auto mt-1 mb-2">&copy;2025 MCSR Japan Community</p>
        </v-footer>
    </v-app>
</template>

<script setup lang="ts">
import { pages } from '~/assets/data/pages';

const error = useError()

const drawer = ref(false)
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