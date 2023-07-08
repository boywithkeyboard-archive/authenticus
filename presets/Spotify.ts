import { createPreset } from '../createPreset.ts'

export type SpotifyUser = {
  display_name: string
  email: string
  external_urls: {
    spotify: string
  }
  followers: {
    href: string | null
    total: number
  }
  href: string
  id: string
  images: {
    height: number | null
    url: string
    width: number | null
  }[]
  type: string
  uri: string
}

/**
 * Check out [Spotify's Developer Portal](https://developer.spotify.com/dashboard) to learn more.
 *
 * Default scopes:
 * - `user-read-email`
 * - `user-read-currently-playing`
 * - `user-library-read`
 * - `user-read-playback-state`
 *
 * @since v1.0
 * @version July 2023
 */
export const Spotify = createPreset<
  SpotifyUser,
  {
    redirectUri: string
    showDialog?: boolean
  }
>({
  authorizeUri: 'accounts.spotify.com/authorize',
  tokenUri: 'accounts.spotify.com/api/token',
  userUri: 'api.spotify.com/v1/me',

  scopes: [
    'user-read-email',
    'user-library-read',
    'user-read-currently-playing',
    'user-read-playback-state',
  ],

  contentType: {
    tokenEndpoint: 'query+header',
  },

  getNormalizedUser(user) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.display_name.includes(' ')
        ? user.display_name.split(' ')[0]
        : user.display_name,
      lastName: user.display_name.includes(' ')
        ? user.display_name.split(' ')[1]
        : null,
      avatarUrl: user.images[0].url,
    }
  },
})
