<script setup lang="ts">
import { pages } from '~/assets/data/pages'

const model = defineModel<boolean>();
const query = ref("");
const results = ref<any[]>([]);
const { buildIndex, search } = useMdSearch()
const route = useRoute()
const searchCategories = pages.filter(f => f.search === true).flat

watch(route, async r => {
  const cat = getFirstSegment(r.path)
  if (cat in searchCategories) await buildIndex(cat)
})

watch(query, (val) => {
  results.value = search(val)
})
</script>

<template>
  <v-dialog v-model="model" max-width="600">
    <v-card>
      <v-card-title>
        <v-text-field v-model="query" label="検索..." prepend-icon="mdi-magnify" />
      </v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item v-for="(item, i) in results" :key="i" :to="`/${item.id.replace('.md', '')}`">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>