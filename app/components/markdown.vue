<template>
  <v-skeleton-loader v-if="loading" type="article" />

  <div v-else>
    <p class="th-1">{{ meta.title }}</p>
    <p class="ts-085">{{ meta.description }}</p>

    <div v-if="true"></div>

    <v-divider class="mt-4" />

    <div v-html="content" class="markdown-body" />
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";

const route = useRoute();
const { getMarkdown, fetchFiles } = useMarkdown();

const content = ref("");
const meta = ref<any>({});
const loading = ref(true);

const props = defineProps<{
  category: string
}>()

onMounted(async () => {
  try {
    const files: { path: string, slug: string }[] = await fetchFiles(props.category);
    const slugPath = (route.params.slug as string[]).join("/");
    const file = files.filter(f => f.slug == `${props.category}/${slugPath}`)[0]

    if (!file) {
      content.value = "<p>Not found</p>";
    } else {
      const parsed = await getMarkdown(file.path)
      content.value = parsed.html
      meta.value = parsed.meta
    }
  } catch (e) {
    content.value = `<div>${e}</div>`
  } finally {
    loading.value = false;
    useDefCustomMeta({
      title: meta.value.title
    })
  }
});
</script>