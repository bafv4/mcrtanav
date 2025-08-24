<template>
    <NuxtLayout name="default">
        <r-error :error="error" />
    </NuxtLayout>
</template>

<script setup lang="ts">
const error = useError()
</script>