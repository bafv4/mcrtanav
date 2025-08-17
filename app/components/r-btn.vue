<template>
  <div class="d-flex ga-2 align-center" :class="{ 'flex-column': mobile }">
    <router-link v-for="p in pages" :to="p.to" class="btn justify-center rounded d-flex ga-1 align-baseline text-body-2"
      :class="{ 'active': isActive(p.to), 'w-100 py-2 text-body-1': mobile }" v-ripple>
      <span class="d-inline-block">{{ p.title }}</span>
      <v-chip size="small" density="comfortable" v-if="p.version" class="rounded-md">{{ p.version }}</v-chip>
    </router-link>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    pages: aPage[],
    mobile?: boolean
  }>(), {
    mobile: false
  }
)

const isActive = computed(() => {
  return (path: string) => {
    return path === useRoute().path || path === useRoute().fullPath
  }
}) 
</script>

<style lang="scss" scoped>
.btn {
  display: inline-block;
  text-decoration: none;
  color: rgb(var(--v-theme-main-font));
  padding: .35rem .5rem;
}

.btn:hover {
  background-color: rgba(var(--v-theme-primary), 0.1);
}

.btn.active {
  color: rgb(var(--v-theme-primary));
}
</style>