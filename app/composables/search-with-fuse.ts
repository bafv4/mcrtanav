import Fuse from 'fuse.js'
import type { IFuseOptions } from 'fuse.js'

export const useSearchWithFuse = () => {
  // 検索ダイアログの状態管理
  const showSearchDialog = useState<boolean>('search.showDialog', () => false)
  const currentSearchCategory = useState<string>('search.currentCategory', () => '')

  // 検索インデックスと結果
  const searchIndex = useState<Fuse<any> | null>('search.fuseIndex', () => null)
  const searchDocuments = useState<any[]>('search.documents', () => [])
  const searchResults = useState<any[]>('search.results', () => [])
  const searchQuery = useState<string>('search.query', () => '')
  const isIndexBuilding = useState<boolean>('search.indexBuilding', () => false)

  const fuseOptions: IFuseOptions<any> = {
    // 検索対象フィールドとその重み付け
    keys: [
      { name: 'title', weight: 0.4 },           // タイトルを最重要視
      { name: 'description', weight: 0.3 },     // 説明文を重視
      { name: 'tags', weight: 0.2 },            // タグも重要
      { name: 'author', weight: 0.05 },         // 作成者は軽め
      { name: 'body', weight: 0.05 }            // 本文は軽め（長いため）
    ],

    // ファジー検索の設定
    threshold: 0.4,           // 0に近いほど厳密、1に近いほど曖昧
    distance: 100,            // 検索距離
    minMatchCharLength: 2,    // 最小マッチ文字数
    ignoreLocation: true,     // 位置を無視（文書全体から検索）

    // 結果に含める情報
    includeScore: true,       // スコアを含める
    includeMatches: true,     // マッチした部分を含める

    // その他の設定
    shouldSort: true,         // スコアでソート
    findAllMatches: false,    // 最初のマッチのみ
    useExtendedSearch: true   // 拡張検索記法を有効化
  }

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
            tags: file.meta.tags || [],              // 配列のまま保持
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
            tags: file.meta.tags || [],
            author: file.meta.author || "",
            date: file.meta.date || "",
            body: "",
            meta: file.meta
          })
        }
      }

      searchDocuments.value = documents

      // Fuse検索インデックスを構築
      searchIndex.value = new Fuse(documents, fuseOptions)

      console.log(`Fuse search index built for ${category}: ${documents.length} documents`)
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
      // Fuseで検索実行
      const fuseResults = searchIndex.value.search(query)

      // 結果を整形
      const results = fuseResults.map(result => ({
        ...result.item,                           // 元のドキュメント
        score: 1 - (result.score || 0),          // スコアを逆転（高いほど良い）
        matches: result.matches || [],           // マッチした部分
        fuseScore: result.score                  // 元のFuseスコア
      }))

      searchResults.value = results

      console.log(`Search completed: ${results.length} results for "${query}"`)
    } catch (error) {
      console.error('Fuse search error:', error)
      searchResults.value = []
    }
  }

  // 高度な検索クエリの例を提供
  const getSearchTips = () => [
    {
      query: 'ネザー',
      description: '「ネザー」を含む文書を検索'
    },
    {
      query: '=ネザー',
      description: '「ネザー」と完全一致する文書を検索'
    },
    {
      query: "'ネザー ポータル'",
      description: '「ネザー ポータル」を含む文書を検索'
    },
    {
      query: '!初心者',
      description: '「初心者」を含まない文書を検索'
    },
    {
      query: 'ネザー | エンド',
      description: '「ネザー」または「エンド」を含む文書を検索'
    },
    {
      query: 'ネザー エンド',
      description: '「ネザー」と「エンド」の両方を含む文書を検索'
    }
  ]

  // マッチしたテキストをハイライト表示用に処理
  const highlightMatches = (text: string, matches: any[] = []) => {
    if (!matches.length) return text

    // マッチした部分をHTMLでハイライト
    let highlightedText = text
    matches
      .filter(match => match.key === 'title' || match.key === 'description')
      .forEach(match => {
        match.indices.forEach(([start, end]: [number, number]) => {
          const matchedText = text.slice(start, end + 1)
          highlightedText = highlightedText.replace(
            matchedText,
            `<mark class="search-highlight">${matchedText}</mark>`
          )
        })
      })

    return highlightedText
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

  // 検索統計
  const getSearchStats = () => {
    const totalDocs = searchDocuments.value.length
    const resultCount = searchResults.value.length
    const query = searchQuery.value

    return {
      totalDocs,
      resultCount,
      query,
      hasResults: resultCount > 0,
      coverage: totalDocs > 0 ? (resultCount / totalDocs * 100).toFixed(1) : '0'
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
    formatSearchDate,
    getSearchTips,
    highlightMatches,
    getSearchStats,

    // 設定
    fuseOptions
  }
}