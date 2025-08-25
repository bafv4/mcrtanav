import MarkdownIt from 'markdown-it'
import yaml from 'js-yaml'

export const useMarkdown = () => {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true
  })

  const defaultImageRender =
    md.renderer.rules.image ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options)
    }

  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const src = 'https://raw.githubusercontent.com/bafv4/mcrtanav-contents/main/' + token?.attrGet('src')
    const alt = token?.content || token?.attrGet('alt') || ''
    return `<img
              src="${src}" 
              alt="${alt}" 
              class="my-4 rounded-lg"
              style="max-width: 100%;"
            />`
  }

  const fetchFiles = async (category: string) => {
    const url = `https://api.github.com/repos/bafv4/mcrtanav-contents/git/trees/main?recursive=1`
    const res = await fetch(url)
    if (!res.ok) throw new Error("Failed to fetch GitHub files")

    const data = await res.json()
    // Markdown のみ抽出
    return data.tree
      .filter((f: any) => f.type === "blob" && f.path.endsWith(".md") && f.path.startsWith(`md/${category}/`))
      .map((f: any) => {
        const slugPath = f.path
          .replace(`md/`, "")
          .replace(/\.md$/, "")
        return {
          path: f.path,
          slug: slugPath,
        }
      })
  }

  const parse = (raw: string) => {
    let meta: Record<string, any> = {};
    let content = raw;

    // --- で始まる frontmatter を検出
    if (raw.startsWith("---")) {
      const end = raw.indexOf("\n---", 3);
      if (end !== -1) {
        const fm = raw.slice(3, end).trim();
        try {
          meta = yaml.load(fm) as Record<string, any>;
        } catch (e) {
          console.warn("YAML parse error:", e);
        }
        content = raw.slice(end + 4).trim();
      }
    }

    return { content: content, meta: meta }
  }

  const getMarkdown = async (path: string) => {
    const { content, meta } = parse(
      await(
        await fetch('https://raw.githubusercontent.com/bafv4/mcrtanav-contents/main/' + path)
      ).text()
    )

    return {html: md.render(content), meta: meta}
  }

  return { md, getMarkdown, fetchFiles }
}