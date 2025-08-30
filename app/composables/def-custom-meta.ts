import type { LayoutKey } from "#build/types/layouts"

export const useDefCustomMeta = (options: {
  category?: string,
  title: string,
  layout?: false | LayoutKey | undefined,
  auth?: boolean
}) => {
  const meta = useRoute().meta
  onMounted(() => {
    meta.layout = options.layout
  })
  useSeoMeta({
    title: options.title
  })
}