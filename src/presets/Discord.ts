import type { RESTGetAPICurrentUserResult } from 'discord-api-types/v10'
import { NormalizedUser, Preset, PresetOptions } from '../preset'

export type DiscordUser = RESTGetAPICurrentUserResult

/**
 * Check out [Discord's Developer Portal](https://discord.com/developers/applications) to learn more.
 *
 * These are the **default scopes**:
 * - `identify`
 * - `email`
 * 
 * *You can overwrite the default scopes by specifying others!*
 */
export class Discord extends Preset<
  DiscordUser, {
    permissions?: number
    guildId?: string
    disableGuildSelect?: boolean
    redirectUri: string
    prompt?:
      | 'consent'
      | 'none'
  }
> {
  constructor(options: PresetOptions) {
    const { scopes, ...rest } = options

    super({
      ...rest,
      authorizeUri: 'discord.com/oauth2/authorize',
      tokenUri: 'discord.com/api/oauth2/token',
      userUri: 'discord.com/api/users/@me',
      scopes: scopes ?? [
        'identify',
        'email',
      ],
      contentType: {
        tokenEndpoint: 'formdata'
      }
    })
  }

  normalizeUser(
    user: DiscordUser,
    options?: {
      avatarSize?: number
    }
  ): NormalizedUser {
    return {
      id: user.id,
      email: user.email ?? null,
      firstName: null,
      lastName: null,
      avatarUrl: user.avatar
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}?size=${
          options?.avatarSize ?? 64
        }`
        : null
    }
  }
}
