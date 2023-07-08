import { createPreset } from '../createPreset.ts'

export type TwitchUser = {
  data: {
    id: string
    login: string
    display_name: string
    type: string
    broadcaster_type: string
    description: string
    profile_image_url: string
    offline_image_url: string
    view_count: number
    email: string
    created_at: string
  }[]
}

/**
 * Check out [Twitch's Developer Portal](https://dev.twitch.tv/console/apps) to learn more.
 *
 * Default scopes:
 * - `user:read:email`
 *
 * @since v2.0
 * @version July 2023
 */
export const Twitch = createPreset<
  TwitchUser,
  {
    redirectUri: string
    forceVerify?: boolean
  },
  {
    clientId: string
  }
>({
  authorizeUri: 'id.twitch.tv/oauth2/authorize',
  tokenUri: 'id.twitch.tv/oauth2/token',
  userUri: 'api.twitch.tv/helix/users',

  scopes: [
    'user:read:email',
  ],

  getNormalizedUser(user) {
    return {
      id: user.data[0].id,
      email: user.data[0].email,
      firstName: null,
      lastName: null,
      avatarUrl: user.data[0].profile_image_url,
    }
  },
})
