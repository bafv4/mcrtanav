import lunr from 'lunr'
import { useMarkdown } from './markdown'

export const useMdSearch = () => {
  const index = ref<lunr.Index | null>(null);
  const documents = ref<any[]>([]);

  const buildIndex = async (category: string) => {
    const { fetchFilesWithMeta, getMarkdown } = useMarkdown();

    try {
      // メタデータ付きでファイル一覧を取得
      const filesWithMeta = await fetchFilesWithMeta(category);

      const docs: any[] = [];

      // 各ファイルの本文を取得（既にメタデータは取得済み）
      for (const file of filesWithMeta) {
        try {
          // 本文のみを再取得（メタデータは既に取得済み）
          const parsed = await getMarkdown(file.path);

          docs.push({
            id: file.path,              // 固有ID
            slug: file.slug,            // ページ遷移用
            title: file.meta.title,
            description: file.meta.description,
            tags: (file.meta.tags || []).join(" "),
            author: file.meta.author || "",
            date: file.meta.date || "",
            body: parsed.html,          // 本文HTML
            meta: file.meta            // 全メタデータを保持
          });
        } catch (error) {
          console.warn(`Failed to process ${file.path} for search:`, error);
          // エラーの場合でもメタデータのみで追加
          docs.push({
            id: file.path,
            slug: file.slug,
            title: file.meta.title,
            description: file.meta.description,
            tags: (file.meta.tags || []).join(" "),
            author: file.meta.author || "",
            date: file.meta.date || "",
            body: "",
            meta: file.meta
          });
        }
      }

      documents.value = docs;

      // Lunr インデックスを構築
      index.value = lunr(function () {
        this.ref("id");
        this.field("title", { boost: 10 });
        this.field("description", { boost: 5 });
        this.field("tags", { boost: 8 });
        this.field("author", { boost: 3 });
        this.field("body");

        docs.forEach((doc) => this.add(doc));
      });

      console.log(`Search index built for ${category}: ${docs.length} documents`);
    } catch (error) {
      console.error(`Failed to build search index for ${category}:`, error);
    }
  };

  const search = (query: string) => {
    if (!index.value || !query.trim()) return [];

    try {
      return index.value.search(query).map((r) => {
        const doc = documents.value.find((d) => d.id === r.ref);
        return {
          ...doc,
          score: r.score // 検索スコアも含める
        };
      });
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  };

  return { buildIndex, search, documents };
}