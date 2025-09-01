<template>
  <div class="head">
    <p class="th-1">ルール</p>
    <p class="text-body-2 text-medium-emphasis mb-4">マインクラフトRTAのルールや規則について説明しています。</p>
  </div>

  <v-skeleton-loader v-if="loading" type="list-item-three-line@3" :loading="true" />

  <div v-else-if="files.length === 0" class="text-center pa-8">
    <v-icon icon="mdi-file-document-outline" size="48" class="mb-2 text-medium-emphasis" />
    <p class="text-body-1 text-medium-emphasis">ルールはありません。</p>
  </div>

  <div v-else class="d-flex flex-column ga-3">
    <v-card v-for="(file, i) in files" :key="i" :to="`/${file.slug}`" variant="outlined" hover class="cursor-pointer">
      <v-card-item>
        <div class="d-flex align-start justify-space-between">
          <div class="flex-grow-1">
            <v-card-title class="text-h6 pa-0 mb-2">
              {{ file.meta.title }}
            </v-card-title>

            <v-card-subtitle v-if="file.meta.description" class="pa-0 mb-2">
              {{ file.meta.description }}
            </v-card-subtitle>

            <div class="d-flex align-center flex-wrap ga-2">
              <!-- タグ表示 -->
              <v-chip v-for="tag in file.meta.tags" :key="tag" size="small" variant="tonal" color="secondary">
                {{ tag }}
              </v-chip>

              <!-- 作成者表示 -->
              <v-chip v-if="file.meta.author" size="small" variant="outlined" prepend-icon="mdi-account">
                {{ file.meta.author }}
              </v-chip>
            </div>
          </div>

          <!-- 日付表示 -->
          <div v-if="file.meta.date" class="text-caption text-medium-emphasis ml-4">
            {{ formatDate(file.meta.date) }}
          </div>
        </div>
      </v-card-item>

      <v-card-actions class="pt-0">
        <v-btn variant="text" color="secondary" append-icon="mdi-arrow-right" size="small">
          読む
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
const { fetchFilesWithMeta, formatDate } = useMarkdown()
const files = ref<any[]>([]);
const loading = ref(true);

useDefCustomMeta({
  title: 'ルール'
})

// 日付フォーマット関数（useMarkdownから使用）
// const formatDate = (dateString: string) => {
//   try {
//     const date = new Date(dateString)
//     return date.toLocaleDateString('ja-JP', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     })
//   } catch {
//     return dateString
//   }
// }

onMounted(async () => {
  try {
    files.value = await fetchFilesWithMeta('rules');
    console.log('Loaded rules with metadata:', files.value)
  } catch (error) {
    console.error('Failed to load rules files:', error)
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.v-card:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease-in-out;
}
</style>