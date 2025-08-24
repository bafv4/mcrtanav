<template>
  <div class="head">
    <p class="th-1">ガイド</p>
  </div>

  <v-skeleton-loader v-if="loading" type="list-item" :loading="true" />

  <p v-else-if="files.length==0">ガイドはありません。</p>

  <v-list v-else>
    <v-list-item v-for="(f, i) in files" :key="i" :to="`${f.slug}`">
      <v-list-item-title>{{ f.slug }}</v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script lang="ts" setup>
const fetchFiles = useMarkdown().fetchFiles
const files = ref<any[]>([]);
const loading = ref(true);

useDefCustomMeta({
  title: 'ガイド'
})

onMounted(async () => {
  try {
    files.value = await fetchFiles('guide');
  } finally {
    loading.value = false;
    console.log(files.value)
  }
});
</script>

<style>

</style>