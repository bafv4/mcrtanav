<template>
  <v-dialog v-model="showSearchDialog" max-width="700">
    <v-card>
      <v-card-title class="pa-4">
        <div class="d-flex align-center ga-3 mb-2">
          <v-icon icon="mdi-magnify" />
          <span class="text-h6">{{ getCategoryDisplayName(currentSearchCategory) }}を検索</span>
        </div>
        <v-text-field :model-value="searchQuery" @update:model-value="performSearch" label="検索キーワードを入力..."
          prepend-icon="mdi-magnify" variant="outlined" density="compact" hide-details autofocus
          :loading="isIndexBuilding" :disabled="isIndexBuilding" clearable />
      </v-card-title>

      <v-card-text class="pa-0" style="max-height: 60vh; overflow-y: auto;">
        <!-- インデックス構築中 -->
        <div v-if="isIndexBuilding" class="text-center pa-8">
          <v-progress-circular indeterminate color="primary" class="mb-2" />
          <p class="text-body-2 text-medium-emphasis">検索インデックスを構築中...</p>
        </div>

        <!-- 検索前の状態 -->
        <div v-else-if="!searchQuery.trim()" class="text-center pa-8 text-medium-emphasis">
          <v-icon icon="mdi-magnify" size="48" class="mb-2" />
          <p>{{ getCategoryDisplayName(currentSearchCategory) }}内で検索できます</p>
          <p class="text-caption">検索キーワードを入力してください</p>
        </div>

        <!-- 検索結果なし -->
        <div v-else-if="searchResults.length === 0" class="text-center pa-8 text-medium-emphasis">
          <v-icon icon="mdi-file-search-outline" size="48" class="mb-2" />
          <p>「{{ searchQuery }}」に一致するページが見つかりませんでした</p>
          <p class="text-caption">別のキーワードで検索してみてください</p>
        </div>

        <!-- 検索結果 -->
        <v-list v-else lines="three">
          <v-list-item v-for="(item, i) in searchResults" :key="i" :to="`/${item.slug}`" @click="closeSearchDialog"
            class="border-b">
            <template #prepend>
              <v-avatar color="primary" variant="tonal">
                <v-icon icon="mdi-file-document-outline" />
              </v-avatar>
            </template>

            <v-list-item-title class="text-wrap">
              {{ item.title }}
            </v-list-item-title>

            <v-list-item-subtitle class="text-wrap mt-1">
              {{ item.description }}
            </v-list-item-subtitle>

            <template #append>
              <div class="text-right">
                <div v-if="item.meta?.date" class="text-caption text-medium-emphasis">
                  {{ formatSearchDate(item.meta.date) }}
                </div>
                <div v-if="item.score" class="text-caption text-medium-emphasis mt-1">
                  関連度: {{ Math.round(item.score * 100) }}%
                </div>
              </div>
            </template>

            <!-- タグ表示 -->
            <template v-if="item.meta?.tags?.length">
              <div class="d-flex flex-wrap ga-1 mt-2">
                <v-chip v-for="tag in item.meta.tags.slice(0, 3)" :key="tag" size="x-small" variant="tonal"
                  color="primary">
                  {{ tag }}
                </v-chip>
                <v-chip v-if="item.meta.tags.length > 3" size="x-small" variant="outlined">
                  +{{ item.meta.tags.length - 3 }}
                </v-chip>
              </div>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="text" @click="closeSearchDialog">
          閉じる
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const {
  showSearchDialog,
  currentSearchCategory,
  searchResults,
  searchQuery,
  isIndexBuilding,
  performSearch,
  closeSearchDialog,
  getCategoryDisplayName,
  formatSearchDate
} = useSearch()
</script>