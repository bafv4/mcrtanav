export default defineOAuthDiscordEventHandler({
  config: {
    scope: ['identify', 'guilds'],
  },

  async onSuccess(event, { user }) {
    const config = useRuntimeConfig()

    // ギルドメンバーのロールを取得
    const member = await $fetch<{ roles: string[] }>(
      `https://discord.com/api/guilds/${config.targetGuildId}/members/${user.id}`,
      {
        headers: { Authorization: `Bot ${config.discordBotToken}` },
      }
    )

    // ロールチェック
    const allowed = member.roles.some((r) => config.allowedRoleIds.includes(r))
    if (!allowed) {
      throw createError({ statusCode: 403, statusMessage: 'Access denied' })
    }

    // セッション保存
    await setUserSession(event, {
      user: {
        id: user.id,
        name: user.username,
        roles: member.roles,
      },
      loggedInAt: new Date().toISOString(),
    })

    return sendRedirect(event, '/')
  },

  onError(event, error) {
    console.error(error)
    return sendRedirect(event, '/login')
  },
})