<template>
    <v-app>
        <v-app-bar class="bar select-none" density="comfortable" elevation="2" app>
            <v-btn class="d-block position-absolute ml-4 d-sm-none" size="medium" icon="mdi-menu" :ripple="false"
                variant="plain" @click="drawer = !drawer" />
            <v-container class="d-flex ga-4 justify-end align-center">
                <v-btn variant="plain"
                    class="d-none d-sm-flex text-caption-1 cursor-not-allowed text-decoration-line-through" to="/"
                    v-if="$route.path != '/'" disabled title="現在このオプションは使用できません。">
                    <template #prepend>
                        <v-avatar class="d-inline-block align-center" image="/img/icon_left.png" size="20" />
                    </template>
                    ホームへ
                </v-btn>

                <v-app-bar-title
                    class="d-flex align-center cursor-pointer text-subtitle-1 text-weight-bold justify-center justify-sm-start"
                    @click="$router.push('/tools')" v-if="category">
                    {{ category }}
                </v-app-bar-title>
                <v-app-bar-title class="h-100" v-else>
                    <pagemark />
                </v-app-bar-title>

                <v-divider vertical class="d-none d-sm-flex" />

                <div class="d-none d-sm-flex">
                    <r-btn :pages="pages" />
                </div>
            </v-container>
        </v-app-bar>

        <v-navigation-drawer class="drawer d-block d-sm-none" v-model="drawer" app>
            <v-container class="d-flex flex-column justify-start ga-2">
                <r-btn :pages="pages" mobile />

                <div class="d-flex bottom-0 d-none">
                    <v-divider />

                    <v-btn variant="plain" block class="text-caption-1 d-flex" to="/">
                        <template #prepend><v-img src="/img/icon_left.png" width="1.5em"></v-img></template>
                        ホームへ
                    </v-btn>
                </div>
            </v-container>
        </v-navigation-drawer>

        <v-container class="mt-16">
            <NuxtPage />
        </v-container>

        <v-footer class="border-t-md border-dotted" color="background" style="flex-shrink: 1; flex-grow: 0;">
            <p class="text-caption mx-auto mt-1 mb-2">&copy;2025 MCSR Japan Community</p>
        </v-footer>
    </v-app>
</template>

<script setup lang="ts">
const pages = computed((): aPage[] => useRoute().meta.pages as aPage[])
const category = computed((): string => useRoute().meta.category as string)

const drawer = ref(false)
</script>

<style lang="scss" scoped>
.title {
    font-family: 'VT323';
}

.bar {
    background-color: rgba(var(--v-theme-background), .8) !important;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
}

.drawer {
    background-color: rgba(var(--v-theme-background), .8) !important;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
}
</style>