import MarkdownIt from 'markdown-it'
import yaml from 'js-yaml'

const GITHUB_API_BASE = 'https://api.github.com/repos/bafv4/mcrtanav-contents/git/trees/main?recursive=1'
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/bafv4/mcrtanav-contents/main'

export const useMarkdown = () => {
  // Markdown-itの設定
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true
  })

  // 画像パスを自動で修正
  md.renderer.rules.image = (tokens, idx) => {
    const token = tokens[idx]
    const src = `${GITHUB_RAW_BASE}/${token?.attrGet('src')}`
    const alt = token?.content || token?.attrGet('alt') || ''
    return `<img src="${src}" alt="${alt}" class="my-4 rounded-lg" style="max-width: 100%;" />`
  }

  // frontmatterを解析
  const parseFrontmatter = (content: string) => {
    let meta: Record<string, any> = {}
    let body = content

    if (content.startsWith("---")) {
      const endIndex = content.indexOf("\n---", 3)
      if (endIndex !== -1) {
        const frontmatter = content.slice(3, endIndex).trim()
        body = content.slice(endIndex + 4).trim()

        try {
          meta = yaml.load(frontmatter) as Record<string, any>
        } catch (error) {
          console.warn("YAML parse error:", error)
        }
      }
    }

    return { meta, body }
  }

  // ファイル一覧を取得（パスのみ）
  const fetchFiles = async (category: string) => {
    const response = await fetch(GITHUB_API_BASE)
    if (!response.ok) throw new Error("Failed to fetch GitHub files")

    const data = await response.json()

    return data.tree
      .filter((file: any) =>
        file.type === "blob" &&
        file.path.endsWith(".md") &&
        file.path.startsWith(`md/${category}/`)
      )
      .map((file: any) => ({
        path: file.path,
        slug: file.path.replace(`md/`, "").replace(/\.md$/, "")
      }))
  }

  // ファイル一覧をメタデータ付きで取得
  const fetchFilesWithMeta = async (category: string) => {
    const files = await fetchFiles(category)

    // 各ファイルのメタデータを並行取得
    const filesWithMeta = await Promise.all(
      files.map(async (file: any) => {
        try {
          const response = await fetch(`${GITHUB_RAW_BASE}/${file.path}`)
          if (!response.ok) {
            throw new Error(`Failed to fetch ${file.path}`)
          }

          const content = await response.text()
          const { meta } = parseFrontmatter(content)

          return {
            ...file,
            meta: {
              title: meta.title || file.slug,
              description: meta.description || '',
              tags: meta.tags || [],
              author: meta.author || null,
              date: meta.date || null,
              order: meta.order || 999,
              ...meta
            }
          }
        } catch (error) {
          console.warn(`Error processing ${file.path}:`, error)
          return {
            ...file,
            meta: {
              title: file.slug,
              description: 'ファイルの読み込みに失敗しました',
              tags: [],
              author: null,
              date: null,
              order: 999
            }
          }
        }
      })
    )

    // ソート: order → date → title
    return filesWithMeta.sort((a, b) => {
      // orderでソート
      if (a.meta.order !== b.meta.order) {
        return a.meta.order - b.meta.order
      }

      // 日付でソート（新しいものが先）
      if (a.meta.date && b.meta.date) {
        return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
      }

      // タイトルでソート
      return a.meta.title.localeCompare(b.meta.title)
    })
  }

  // 単一ファイルを取得してHTMLに変換
  const getMarkdown = async (path: string) => {
    const response = await fetch(`${GITHUB_RAW_BASE}/${path}`)
    if (!response.ok) throw new Error(`Failed to fetch ${path}`)

    const content = await response.text()
    const { meta, body } = parseFrontmatter(content)

    return {
      html: md.render(body),
      meta
    }
  }

  // 日付フォーマット用ヘルパー
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  return {
    md,
    fetchFiles,
    fetchFilesWithMeta,
    getMarkdown,
    formatDate
  }
}