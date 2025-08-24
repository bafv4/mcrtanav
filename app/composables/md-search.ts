import lunr from 'lunr'
import { useMarkdown } from './markdown'

export const useMdSearch = () => {
  const index = ref<lunr.Index | null>(null);
  const documents = ref<any[]>([]);

  const buildIndex = async (category: string) => {
    const { fetchFiles, getMarkdown } = useMarkdown();
    const files = await fetchFiles(category);

    const docs: any[] = [];
    for (const f of files) {
      const parsed = await getMarkdown(f.slug);

      docs.push({
        id: f.path,              // 固有ID
        slug: f.slug,            // ページ遷移用
        title: parsed.meta.title || f.slug,
        description: parsed.meta.description || "",
        tags: (parsed.meta.tags || []).join(" "),
        body: parsed.html,               // 本文
      });
    }

    documents.value = docs;

    index.value = lunr(function () {
      this.ref("id");
      this.field("title", { boost: 10 });
      this.field("description", { boost: 5 });
      this.field("tags", { boost: 8 });
      this.field("body");

      docs.forEach((doc) => this.add(doc));
    });
  };

  const search = (query: string) => {
    if (!index.value) return [];
    return index.value.search(query).map((r) =>
      documents.value.find((d) => d.id === r.ref)
    );
  };

  return { buildIndex, search, documents };
}
