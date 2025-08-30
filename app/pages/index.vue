<template>
  <v-card class="h-100 d-flex flex-column justify-center mt-4 ga-4 pa-8" loading>
    <div>
      <v-card-title class="text-h4 text-center">WIP</v-card-title>
      <v-card-subtitle class="text-subtitle-1 text-center text-pre-wrap">このページは準備中です。（トップページになる予定ですが。）</v-card-subtitle>
    </div>

    <router-link to="/moderation">Moderation</router-link>
  </v-card>
</template>

<script lang="ts" setup>
const router = useRouter()

useDefCustomMeta({
  category: 'root',
  title: 'ホーム'
})

onMounted(() => {
  const redirect = sessionStorage.getItem('redirectAfterLogin')
  if (redirect) {
    sessionStorage.removeItem('redirectAfterLogin')
    router.replace(redirect)
  }
})
</script>ww