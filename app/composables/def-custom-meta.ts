import type { LayoutKey } from "#build/types/layouts"
import auth from "~/middleware/auth"

export const useDefCustomMeta = (options: {
  category?: string,
  title: string,
  layout?: false | LayoutKey | undefined,
  auth?: boolean
}) => {
  const meta = useRoute().meta
  onMounted(() => {
    meta.layout = options.layout
    if (options.auth) {
      meta.auth = true
      meta.middleware = [auth]
    } else {
      meta.auth = false
      meta.middleware = []
    }
  })
  useSeoMeta({
    title: options.title
  })
}