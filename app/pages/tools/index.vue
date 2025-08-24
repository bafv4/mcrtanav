<script lang="ts" setup>
useDefCustomMeta({
  category: 'tools',
  title: 'ツールページ'
})

onMounted(() => useRouter().push('/tools/list'))
</script>