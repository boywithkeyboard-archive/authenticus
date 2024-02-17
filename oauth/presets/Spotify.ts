import { Preset, PresetOptions } from '../preset'

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
  [key: string]: unknown
}

/**
 * Check out [Spotify's Developer Portal](https://developer.spotify.com/dashboard) to learn more.
 *
 * These are the **default scopes**:
 * - `user-read-email`
 * - `user-read-currently-playing`
 * - `user-library-read`
 * - `user-read-playback-state`
 * 
 * *You can overwrite the default scopes by specifying others!*
 */
export class Spotify extends Preset<
  SpotifyUser, {
    redirectUri: string
    showDialog?: boolean
  }
> {
  constructor(options: PresetOptions) {
    const { scopes, ...rest } = options

    super({
      ...rest,
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
        tokenEndpoint: 'query+header'
      }
    })
  }

  normalizeUser(user: SpotifyUser) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.name ? (
        user.display_name.split(' ').length > 1
           ? user.display_name.split(' ')[0]
           : user.display_name
      ) : null,
      lastName: user.display_name ? (
        user.display_name.split(' ').length > 1
           ? user.display_name.split(' ')[0]
           : null
      ) : null,
      avatarUrl: user.images[0].url
    }
  }
}
