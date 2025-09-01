import yaml from 'js-yaml'

export interface FileMetadata {
  title?: string
  description?: string
  tags?: string[]
  author?: string
  date?: string
  order?: number
  [key: string]: any
}

export interface ParsedMarkdown {
  meta: FileMetadata
  body: string
}

/**
 * Frontmatterを解析してメタデータと本文を分離
 */
export function parseFrontmatter(content: string): ParsedMarkdown {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/

  const match = content.match(frontmatterRegex)
  if (!match) {
    return {
      meta: {},
      body: content.trim()
    }
  }

  try {
    const yamlContent = match[1]
    if (!yamlContent) {
      return {
        meta: {},
        body: match[2]?.trim() || ''
      }
    }
    
    const meta = (yaml.load(yamlContent) as FileMetadata) || {}
    const body = match[2]?.trim() || ''
    
    return { meta, body }
  } catch (error) {
    console.warn('Failed to parse frontmatter:', error)
    return {
      meta: {},
      body: content.trim()
    }
  }
}

/**
 * ファイルソート用のコンパレータ関数
 * order → date → title の順でソート
 */
export function createFileComparator(a: any, b: any): number {
  // order でソート (数値、小さい順)
  if (a.meta.order !== b.meta.order) {
    const orderA = a.meta.order ?? 999
    const orderB = b.meta.order ?? 999
    return orderA - orderB
  }

  // date でソート (新しい順)
  if (a.meta.date && b.meta.date) {
    const dateA = new Date(a.meta.date).getTime()
    const dateB = new Date(b.meta.date).getTime()
    if (dateA !== dateB) {
      return dateB - dateA
    }
  } else if (a.meta.date && !b.meta.date) {
    return -1
  } else if (!a.meta.date && b.meta.date) {
    return 1
  }

  // title でソート (文字列、昇順)
  const titleA = a.meta.title || a.slug || ''
  const titleB = b.meta.title || b.slug || ''
  return titleA.localeCompare(titleB, 'ja')
}