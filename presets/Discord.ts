import { createPreset } from '../createPreset.ts'

export type DiscordUser = {
  id: string
  username: string
  global_name: string | null
  avatar: string | null
  discriminator: string
  public_flags: number
  flags: number
  banner: string | null
  banner_color: string | null
  accent_color: string | null
  locale: string
  mfa_enabled: boolean
  premium_type: number
  avatar_decoration: string | null
  email: string
  verified: boolean
}

/**
 * Check out [Discord's Developer Portal](https://discord.com/developers/applications) to learn more.
 *
 * Default scopes:
 * - `identify`
 * - `email`
 */
export const Discord = createPreset<
  DiscordUser,
  {
    permissions?: number
    guildId?: string
    disableGuildSelect?: boolean
    redirectUri: string
    prompt?:
      | 'consent'
      | 'none'
  }
>({
  authorizeUri: 'discord.com/oauth2/authorize',
  userUri: 'discord.com/api/users/@me',
  tokenUri: 'discord.com/api/oauth2/token',

  scopes: [
    'identify',
    'email',
  ],

  contentType: {
    tokenEndpoint: 'formdata',
  },

  getNormalizedUser(user, options) {
    if (!user.avatar) {
      return {
        id: user.id,
        email: user.email,
        firstName: null,
        lastName: null,
        avatarUrl: null,
      }
    }

    const avatarUrl = new URL(user.avatar)

    avatarUrl.searchParams.set('size', `${options?.avatarSize ?? 64}`)

    return {
      id: user.id,
      email: user.email,
      firstName: null,
      lastName: null,
      avatarUrl: avatarUrl.toString(),
    }
  },
})
