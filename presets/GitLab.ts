import { stringifyQuery } from 'https://gist.githubusercontent.com/boywithkeyboard/4873e54415ac365a84d05107c5c436b8/raw/faa69f55abf99a1f8452b1f9d3b9fe703a0475be/stringifyQuery.ts'

export class GitLab {
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
   * - `read_user`
   * - `profile`
   * - `email`
   */
  getRedirectUrl({
    scope = ['read_user', 'email', 'profile'],
    state,
    callbackUrl
  }: {
    scope?: string[]
    state?: string
    callbackUrl: string
  }) {
    return `https://gitlab.com/oauth/authorize?${
      stringifyQuery({
        client_id: this.#clientId,
        scope: scope.join(' '),
        response_type: 'code',
        ...(state && { state }),
        redirect_uri: callbackUrl
      })
    }`
  }

  async getUser(token: string) {
    const userResponse = await fetch('https://gitlab.com/api/v4/user', {
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
    createdAt: number
    type: string
  } | undefined> {
    const body = new FormData()

    body.set('client_id', this.#clientId)
    body.set('client_secret', this.#clientSecret)
    body.set('code', code)
    body.set('grant_type', 'authorization_code')
    body.set('redirect_uri', callbackUrl)

    const response = await fetch('https://gitlab.com/oauth/token', {
      method: 'POST',
      headers: {
        accept: 'application/json'
      },
      body
    })

    if (!response.ok)
      return

    const result = await response.json()

    return {
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
      expiresIn: result.expires_in,
      createdAt: result.created_at,
      type: result.token_type
    }
  }
}
