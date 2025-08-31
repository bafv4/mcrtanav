import lunr from 'lunr'

export const useSearch = () => {
  // 検索ダイアログの状態管理
  const showSearchDialog = useState<boolean>('search.showDialog', () => false)
  const currentSearchCategory = useState<string>('search.currentCategory', () => '')

  // 検索インデックスと結果
  const searchIndex = useState<lunr.Index | null>('search.index', () => null)
  const searchDocuments = useState<any[]>('search.documents', () => [])
  const searchResults = useState<any[]>('search.results', () => [])
  const searchQuery = useState<string>('search.query', () => '')
  const isIndexBuilding = useState<boolean>('search.indexBuilding', () => false)

  // カテゴリー名マッピング
  const getCategoryDisplayName = (category: string) => {
    const categoryMap: Record<string, string> = {
      'guide': 'ガイド',
      'rules': 'ルール'
    }
    return categoryMap[category] || category
  }

  // 検索ダイアログを開く
  const openSearchDialog = (category: string) => {
    currentSearchCategory.value = category
    showSearchDialog.value = true

    // インデックスが未構築の場合は構築
    if (!searchIndex.value || searchDocuments.value.length === 0) {
      buildSearchIndex(category)
    }
  }

  // 検索ダイアログを閉じる
  const closeSearchDialog = () => {
    showSearchDialog.value = false
    searchQuery.value = ''
    searchResults.value = []
  }

  // 検索インデックスを構築
  const buildSearchIndex = async (category: string) => {
    isIndexBuilding.value = true

    try {
      const { fetchFilesWithMeta, getMarkdown } = useMarkdown()

      // メタデータ付きでファイル一覧を取得
      const filesWithMeta = await fetchFilesWithMeta(category)
      const documents: any[] = []

      // 各ファイルの本文を取得
      for (const file of filesWithMeta) {
        try {
          const parsed = await getMarkdown(file.path)

          documents.push({
            id: file.path,
            slug: file.slug,
            title: file.meta.title,
            description: file.meta.description,
            tags: (file.meta.tags || []).join(" "),
            author: file.meta.author || "",
            date: file.meta.date || "",
            body: parsed.html.replace(/<[^>]*>/g, ''), // HTMLタグを除去
            meta: file.meta
          })
        } catch (error) {
          console.warn(`Failed to process ${file.path} for search:`, error)
          // エラーの場合でもメタデータのみで追加
          documents.push({
            id: file.path,
            slug: file.slug,
            title: file.meta.title,
            description: file.meta.description,
            tags: (file.meta.tags || []).join(" "),
            author: file.meta.author || "",
            date: file.meta.date || "",
            body: "",
            meta: file.meta
          })
        }
      }

      searchDocuments.value = documents

      // Lunr検索インデックスを構築
      searchIndex.value = lunr(function () {
        this.ref("id")
        this.field("title", { boost: 10 })
        this.field("description", { boost: 5 })
        this.field("tags", { boost: 8 })
        this.field("author", { boost: 3 })
        this.field("body")

        documents.forEach((doc) => this.add(doc))
      })

      console.log(`Search index built for ${category}: ${documents.length} documents`)
      console.log(searchIndex.value)
    } catch (error) {
      console.error(`Failed to build search index for ${category}:`, error)
    } finally {
      isIndexBuilding.value = false
    }
  }

  // 検索を実行
  const performSearch = (query: string) => {
    searchQuery.value = query

    if (!searchIndex.value || !query.trim()) {
      searchResults.value = []
      return
    }

    try {
      const results = searchIndex.value.search(query).map((r) => {
        const doc = searchDocuments.value.find((d) => d.id === r.ref)
        return {
          ...doc,
          score: r.score
        }
      })

      searchResults.value = results
    } catch (error) {
      console.error('Search error:', error)
      searchResults.value = []
    }
  }

  // 日付フォーマット
  const formatSearchDate = (dateString: string) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  return {
    // 状態
    showSearchDialog,
    currentSearchCategory,
    searchResults,
    searchQuery,
    isIndexBuilding,

    // アクション
    openSearchDialog,
    closeSearchDialog,
    buildSearchIndex,
    performSearch,

    // ヘルパー
    getCategoryDisplayName,
    formatSearchDate
  }
}