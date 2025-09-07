import { GuildMemberRoleManager } from 'discord.js'

/** 権限チェック */
export const hasAuthority = (userAuthorities: string[], target: string): boolean => userAuthorities.includes(target)