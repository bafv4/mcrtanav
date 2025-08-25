import { GuildMember } from 'discord.js'

export default defineOAuthDiscordEventHandler({
  config: {
    scope: ['identify', 'guilds', 'guilds.members.read'],
  },

  async onSuccess(event, { user }) {
    const config = useRuntimeConfig()

    // ギルドメンバーのロールを取得
    const member = await $fetch<GuildMember>(
      `https://discord.com/api/guilds/${config.targetGuildId}/members/${user.id}`,
      {
        headers: { Authorization: `Bot ${config.discordBotToken}` },
      }
    )

    // ロールチェック
    const allowed = member.roles.valueOf().some((r) => config.allowedRoleIds.includes(r.toString()))
    if (!allowed) {
      throw createError({ statusCode: 403, statusMessage: 'Access denied' })
    }

    const avatarUrl = member.avatar
      ? `https://cdn.discordapp.com/guilds/${config.targetGuildId}/users/${member.user.id}/avatars/${member.avatar}.png`
      : `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png`

    // セッション保存
    await setUserSession(event, {
      user: {
        id: user.id,
        name: member.user.displayName,
        avatar: avatarUrl
      },
      loggedInAt: new Date().toISOString(),
    })

    console.log(await getUserSession(event))

    return sendRedirect(event, '/')
  },

  onError(event, error) {
    console.error(error)
    return sendRedirect(event, '/login')
  },
})