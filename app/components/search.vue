<template>
  <v-dialog v-model="showSearchDialog" max-width="800" scrollable>
    <v-card>
      <v-card-title class="pa-4 pb-2">
        <div class="d-flex align-center ga-3 mb-3">
          <v-icon icon="mdi-magnify" color="primary" />
          <span class="text-h6">{{ getCategoryDisplayName(currentSearchCategory) }}を検索</span>
          <v-spacer />
          <!-- 検索統計 -->
          <v-chip v-if="searchStats.hasResults" size="small" variant="outlined" color="primary">
            {{ searchStats.resultCount }}/{{ searchStats.totalDocs }}件
          </v-chip>
        </div>

        <v-text-field :model-value="searchQuery" @update:model-value="performSearch" label="検索キーワードを入力..."
          prepend-icon="mdi-magnify" variant="outlined" density="compact" hide-details autofocus
          :loading="isIndexBuilding" :disabled="isIndexBuilding" clearable persistent-hint hint="ファジー検索対応 | 高度な検索も可能" />

        <!-- 検索のヒント -->
        <v-expand-transition>
          <div v-if="showSearchTips" class="mt-3">
            <v-card variant="outlined" class="pa-3">
              <div class="d-flex align-center mb-2">
                <v-icon icon="mdi-lightbulb-outline" size="small" class="mr-2" />
                <span class="text-caption font-weight-bold">検索のコツ</span>
              </div>
              <div class="d-flex flex-wrap ga-1">
                <v-chip v-for="tip in getSearchTips().slice(0, 3)" :key="tip.query" size="x-small" variant="tonal"
                  @click="performSearch(tip.query)" class="cursor-pointer">
                  {{ tip.query }}
                </v-chip>
                <v-tooltip text="高度な検索記法の詳細">
                  <template #activator="{ props }">
                    <v-btn v-bind="props" icon="mdi-help-circle-outline" size="x-small" variant="text"
                      @click="showAdvancedHelp = !showAdvancedHelp" />
                  </template>
                </v-tooltip>
              </div>
            </v-card>
          </div>
        </v-expand-transition>
      </v-card-title>

      <v-card-text class="pa-0" style="max-height: 60vh;">
        <!-- インデックス構築中 -->
        <div v-if="isIndexBuilding" class="text-center pa-8">
          <v-progress-circular indeterminate color="primary" size="48" class="mb-3" />
          <p class="text-body-1 mb-1">検索インデックスを構築中...</p>
          <p class="text-caption text-medium-emphasis">Fuse.jsでファジー検索を準備しています</p>
        </div>

        <!-- 検索前の状態 -->
        <div v-else-if="!searchQuery.trim()" class="text-center pa-8 text-medium-emphasis">
          <v-icon icon="mdi-brain" size="64" class="mb-3" />
          <p class="text-h6 mb-2">インテリジェント検索</p>
          <p class="mb-1">{{ getCategoryDisplayName(currentSearchCategory) }}内で曖昧検索が可能です</p>
          <v-list density="compact" class="bg-transparent mt-4" max-width="300" style="margin: 0 auto;">
            <v-list-item prepend-icon="mdi-check" class="text-caption">
              <span>タイポを自動修正</span>
            </v-list-item>
            <v-list-item prepend-icon="mdi-check" class="text-caption">
              <span>部分一致検索</span>
            </v-list-item>
            <v-list-item prepend-icon="mdi-check" class="text-caption">
              <span>関連度順でソート</span>
            </v-list-item>
          </v-list>
          <v-btn variant="outlined" size="small" class="mt-3" @click="showSearchTips = !showSearchTips">
            {{ showSearchTips ? '検索のコツを隠す' : '検索のコツを見る' }}
          </v-btn>
        </div>

        <!-- 検索結果なし -->
        <div v-else-if="searchResults.length === 0" class="text-center pa-8 text-medium-emphasis">
          <v-icon icon="mdi-file-search-outline" size="48" class="mb-2" />
          <p>「{{ searchQuery }}」に一致するページが見つかりませんでした</p>
          <p class="text-caption mb-4">別のキーワードで検索してみてください</p>

          <!-- 検索提案 -->
          <div class="d-flex justify-center flex-wrap ga-2">
            <v-chip v-for="tip in getSearchTips().slice(0, 2)" :key="tip.query" size="small" variant="outlined"
              @click="performSearch(tip.query)" class="cursor-pointer">
              {{ tip.description }}
            </v-chip>
          </div>
        </div>

        <!-- 検索結果 -->
        <div v-else>
          <!-- 結果サマリー -->
          <div class="px-4 py-2 bg-surface-variant">
            <div class="d-flex align-center justify-space-between">
              <span class="text-caption">
                {{ searchStats.resultCount }}件の結果 ({{ searchStats.coverage }}%カバー率)
              </span>
              <span class="text-caption text-medium-emphasis">
                関連度順でソート
              </span>
            </div>
          </div>

          <v-list lines="three">
            <v-list-item v-for="(item, i) in searchResults" :key="i" :to="`/${item.slug}`" @click="closeSearchDialog"
              class="border-b py-3">
              <template #prepend>
                <v-avatar color="primary" variant="tonal" size="40">
                  <v-icon icon="mdi-file-document-outline" />
                </v-avatar>
              </template>

              <v-list-item-title class="text-wrap mb-1">
                <span v-html="highlightMatches(item.title, item.matches)"></span>
              </v-list-item-title>

              <v-list-item-subtitle class="text-wrap mb-2">
                <span v-html="highlightMatches(item.description, item.matches)"></span>
              </v-list-item-subtitle>

              <!-- スコアとメタデータ -->
              <div class="d-flex align-center flex-wrap ga-2 mb-2">
                <v-chip size="x-small" :color="getScoreColor(item.score)" variant="tonal">
                  {{ Math.round(item.score * 100) }}%
                </v-chip>

                <v-chip v-if="item.meta?.author" size="x-small" variant="outlined" prepend-icon="mdi-account">
                  {{ item.meta.author }}
                </v-chip>

                <v-chip v-if="item.meta?.date" size="x-small" variant="outlined" prepend-icon="mdi-calendar">
                  {{ formatSearchDate(item.meta.date) }}
                </v-chip>
              </div>

              <!-- タグ表示 -->
              <div v-if="item.meta?.tags?.length" class="d-flex flex-wrap ga-1">
                <v-chip v-for="tag in item.meta.tags.slice(0, 3)" :key="tag" size="x-small" variant="tonal"
                  color="primary">
                  {{ tag }}
                </v-chip>
                <v-chip v-if="item.meta.tags.length > 3" size="x-small" variant="outlined">
                  +{{ item.meta.tags.length - 3 }}
                </v-chip>
              </div>
            </v-list-item>
          </v-list>
        </div>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-btn prepend-icon="mdi-help-circle" variant="text" size="small" @click="showAdvancedHelp = !showAdvancedHelp">
          高度な検索
        </v-btn>
        <v-spacer />
        <v-btn variant="text" @click="closeSearchDialog">
          閉じる
        </v-btn>
      </v-card-actions>

      <!-- 高度な検索ヘルプ -->
      <v-expand-transition>
        <v-card-text v-if="showAdvancedHelp" class="pt-0">
          <v-divider class="mb-3" />
          <div class="text-subtitle-2 mb-2">高度な検索記法</div>
          <v-list density="compact" class="bg-transparent">
            <v-list-item v-for="tip in getSearchTips()" :key="tip.query" @click="performSearch(tip.query)"
              class="cursor-pointer rounded">
              <template #prepend>
                <v-code class="text-caption bg-surface-variant pa-1">
                  {{ tip.query }}
                </v-code>
              </template>
              <v-list-item-title class="text-caption">
                {{ tip.description }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-expand-transition>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useSearchWithFuse } from '~/composables/search-with-fuse'

const {
  showSearchDialog,
  currentSearchCategory,
  searchResults,
  searchQuery,
  isIndexBuilding,
  performSearch,
  closeSearchDialog,
  getCategoryDisplayName,
  formatSearchDate,
  getSearchTips,
  highlightMatches,
  getSearchStats
} = useSearchWithFuse()

const showSearchTips = ref(false)
const showAdvancedHelp = ref(false)

// 検索統計を計算
const searchStats = computed(() => getSearchStats())

// スコアに基づく色を決定
const getScoreColor = (score: number) => {
  if (score >= 0.8) return 'success'
  if (score >= 0.6) return 'warning'
  return 'error'
}
</script>

<style scoped>
:deep(.search-highlight) {
  background-color: rgb(var(--v-theme-warning));
  padding: 2px 4px;
  border-radius: 4px;
  font-weight: bold;
}

.v-list-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.1);
}
</style>