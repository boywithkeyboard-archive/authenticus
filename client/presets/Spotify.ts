import { Preset } from '../Preset.ts'

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
 */
export const Spotify = new Preset<
  SpotifyUser,
  {
    redirect_uri: string
    show_dialog?: boolean
  }
>(
  'v1',
  {
    oauth2: {
      authorize_url: 'accounts.spotify.com/authorize',
      user_url: 'api.spotify.com/v1/me',
      token_url: 'accounts.spotify.com/api/token',
      scope: [
        'user-read-email',
        'user-library-read',
        'user-read-currently-playing',
        'user-read-playback-state'
      ]
    },
    advanced: {
      token_endpoint_type: 'query+header'
    }
  }
)
