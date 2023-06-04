import { stringifyQuery } from '../stringifyQuery.ts'

/**
 * Check out Spotify's Developer Portal [here](https://developer.spotify.com/documentation/web-api/tutorials/code-flow).
 */
export class Spotify {
  #clientId
  #clientSecret

  constructor({
    clientId,
    clientSecret
  }: {
    clientId: string
    clientSecret: string
  }) {
    this.#clientId = clientId
    this.#clientSecret = clientSecret
  }

  /**
   * Default Scopes:
   * - `user-library-read`
   * - `user-read-currently-playing`
   * - `user-read-playback-state`
   */
  getRedirectUrl({
    scope = [
      'user-library-read',
      'user-read-currently-playing',
      'user-read-playback-state'
    ],
    state,
    showDialog = false,
    callbackUrl
  }: {
    scope?: string[]
    showDialog?: boolean
    state?: string
    callbackUrl: string
  }) {
    return `https://accounts.spotify.com/authorize?${
      stringifyQuery({
        client_id: this.#clientId,
        scope: scope.join(' '),
        show_dialog: showDialog,
        redirect_uri: callbackUrl,
        ...(state && { state }),
        response_type: 'code'
      })
    }`
  }

  async getUser(token: string) {
    const userResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${token}`
      }
    })

    if (!userResponse.ok)
      return

    // deno-lint-ignore no-explicit-any
    const data: Record<string, any> = await userResponse.json()

    return data
  }

  async getAccessToken(code: string, callbackUrl: string): Promise<{
    accessToken: string
    refreshToken: string
    expiresIn: number
    scope: string
    type: string
  } | undefined> {
    const response = await fetch(`https://accounts.spotify.com/api/token?${
      stringifyQuery({
        code,
        grant_type: 'authorization_code',
        redirect_uri: callbackUrl
      })
    }`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/x-www-form-urlencoded',
        authorization: `Basic ${btoa(`${this.#clientId}:${this.#clientSecret}`)}`
      }
    })

    const result = await response.json()

    if (!response.ok)
      return

    return {
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
      expiresIn: result.expires_in,
      scope: result.scope.split(' '),
      type: result.token_type
    }
  }
}
