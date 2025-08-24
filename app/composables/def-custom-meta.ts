import type { LayoutKey } from "#build/types/layouts"

export const useDefCustomMeta = (options: {
  category?: string,
  title: string,
  layout?: false | LayoutKey | undefined,
  requiresAuth?: boolean
}) => {
  const meta = useRoute().meta
  onMounted(() => {
    meta.layout = options.layout
    meta.requiresAuth = options.requiresAuth
  })
  useSeoMeta({
    title: options.title
  })
}