import { GuildMember } from 'discord.js'

export default defineOAuthDiscordEventHandler({
  config: {
    scope: ['identify', 'guilds', 'guilds.members.read'],
  },

  async onSuccess(event, { user }) {
    const config = useRuntimeConfig()

    try {
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
        // ログイン失敗：権限不足
        return sendRedirect(event, '/?loginFailure=true&error=access_denied')
      }

      const avatarUrl = member.avatar
        ? `https://cdn.discordapp.com/guilds/${config.targetGuildId}/users/${member.user.id}/avatars/${member.avatar}.png`
        : `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png`

      // セッション保存
      await setUserSession(event, {
        user: {
          id: user.id,
          name: member.user.globalName || member.user.username,
          avatar: avatarUrl,
          authority: [], // 必要に応じて権限情報を設定
        },
        loggedInAt: new Date().toISOString(),
      })

      console.log('Welcome, ' + user.name + '!')

      console.log('User logged in:', await getUserSession(event))

      // ログイン成功：リダイレクト先ページに遷移
      return sendRedirect(event, '/login-success')
    } catch (error) {
      console.error('Discord auth error:', error)
      // ログイン失敗：サーバーエラー
      return sendRedirect(event, '/?loginFailure=true&error=server_error')
    }
  },

  onError(event, error) {
    console.error('OAuth error:', error)
    // ログイン失敗：OAuth エラー（ユーザーキャンセル等）
    return sendRedirect(event, '/?loginFailure=true&error=cancelled')
  },
})