<template>
  <div class="d-flex flex-column ga-4">
    <div>
      <p class="th-1 mt-2">リンク集</p>
      <p>マイクラRTAに関するコミュニティなどのリンクを掲載しています。</p>
    </div>

    <v-card class="d-flex flex-column ga-4 pa-4" v-for="s in socials">
      <v-card-title class="d-flex ga-1 align-bottom th-2 my-0">
        <v-icon v-if="s.icon?.type==='mdi'" :icon="`mdi-${s.icon?.iconName}`" />
        <font-awesome-icon v-if="s.icon?.type === 'fab'" :icon="`fab fa-${s.icon?.iconName}`"
          :color="s.icon?.colorCode || `on-background`" class="mt-1" />
        {{ s.name }}
      </v-card-title>

      <v-hover v-for="i in s.links">
        <template v-slot:default="{ isHovering, props }">
          <v-card v-bind="props" class="cursor-pointer" variant="outlined"
            :color="isHovering ? 'primary' : 'on-background'" :elevation="isHovering ? 2 : 0" :href="i.href"
            target="_blank">
            <v-card-title class="d-flex ga-4 th-4">
              <v-icon icon="mdi-open-in-new" />
              {{ i.pageName }}
              <div v-if="i.tags" class="d-flex ga-2">
                <v-chip variant="tonal" size="small" v-for="t in i.tags">{{ t }}</v-chip>
              </div>
            </v-card-title>

            <v-card-text>{{ i.description }}</v-card-text>
          </v-card>
        </template>
      </v-hover>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useTheme } from 'vuetify/lib/composables/theme.mjs';
useDefCustomMeta({
  title: 'リンク集',
  category: 'root'
})

const socials: social[] = [
  {
    name: 'Webサイト',
    icon: {
      type: 'mdi',
      iconName: 'web-box'
    },
    links: [
      {
        pageName: 'Speedrun.com',
        href: 'https://speedrun.com',
        description: '各種ゲームのRTAの記録を管理するサイトです。',
        tags: ['記録']
      },
      {
        pageName: 'マインクラフトRTA Wiki',
        href: 'https://minecraft-rta.playing.wiki/',
        description: 'マインクラフトのRTAのための情報を整理したWikiです。',
        tags: ['日本語', '情報']
      },
      {
        pageName: 'MCSR PaceMan',
        href: 'https://paceman.gg',
        description: 'Java版の世界中の走者のペース通知が見れるサイトです。',
        tags: ['英語', '記録', 'Java版']
      },
      {
        pageName: 'MCSR Ranked',
        href: 'https://mcsrranked.com/',
        description: 'RTAで対戦するModをご存じですか？',
        tags: ['英語', '記録', 'Java版']
      }
    ]
  },
  {
    name: 'Discordサーバー',
    icon: {
      type: 'fab',
      iconName: 'discord'
    },
    links: [
      {
        pageName: 'マイクラRTAのサーバー',
        href: '',
        description: 'マイクラRTAの日本で一番大きなDiscordコミュニティです。'
      }
    ]
  }
]

const theme = useTheme()
</script>

<style>

</style>