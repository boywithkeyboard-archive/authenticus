import { Preset } from '../Preset.ts'

export type DiscordUser = {
  id: string
  username: string
  global_name: null
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
export const Discord = new Preset<
  DiscordUser,
  {
    permissions?: number
    guild_id?: string
    disable_guild_select?: boolean
    redirect_uri: string
    prompt?:
      | 'consent'
      | 'none'
  }
>(
  'v1',
  {
    oauth2: {
      authorize_url: 'discord.com/oauth2/authorize',
      user_url: 'discord.com/api/users/@me',
      token_url: 'discord.com/api/oauth2/token',
      scope: [
        'identify',
        'email'
      ]
    },
    advanced: {
      token_endpoint_type: 'formdata'
    }
  }
)
