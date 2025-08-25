<template>
    <NuxtLayout name="default">
        <p class="th-1">{{ status }}</p>
        <p>{{ message }}</p>
        <dev-only>
            <p class="ts-085 mt-2">{{ error?.stack }}</p>
        </dev-only>
        
        <RouterLink to="/">ホームへ</RouterLink>
    </NuxtLayout>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

const props = defineProps<{ error: { statusCode?: number; statusMessage?: string; stack?: string } }>()

const status = computed(() => {
    if (props.error) {
        return props.error.statusCode + ': ' + props.error.statusMessage
    }
    return '予期しないエラー'
})
const message = computed(() => {
    if (props.error.statusCode === 403) {
        return 'ページの編集・管理にはDiscordサーバーへの参加とロールの付与が必要です。'
    } else if (props.error.statusCode === 404) {
        return 'ページが見つかりません。'
    } else if (props.error.statusCode === 500) {
        return 'サーバー内部でエラーが発生しました。\n' + props.error.stack
    } else {
        return '予期しないエラーが発生しました'
    }
})

useDefCustomMeta({
    title: '(> <;) ｷﾞｮｴｰ!'
})
</script>
