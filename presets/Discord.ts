import { stringifyQuery } from '../stringifyQuery.ts'

/**
 * Check out Discord's Developer Portal [here](https://discord.com/developers/docs/topics/oauth2#oauth2).
 */
export class Discord {
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
   * - `identify`
   * - `email`
   */
  getRedirectUrl({
    scope = ['identify', 'email'],
    permissions,
    callbackUrl,
    guildId,
    disableGuildSelect,
    prompt = 'none'
  }: {
    scope?: string[]
    permissions?: number
    callbackUrl: string
    guildId?: string
    disableGuildSelect?: boolean
    prompt?: 'consent' | 'none'
  }) {
    return `https://discord.com/api/oauth2/authorize?${
      stringifyQuery({
        client_id: this.#clientId,
        ...(permissions && { permissions }),
        redirect_uri: callbackUrl,
        response_type: 'code',
        ...(guildId && { guild_id: guildId }),
        ...(disableGuildSelect && { disable_guild_select: disableGuildSelect }),
        prompt,
        scope: scope.join(' ')
      })
    }`
  }

  async getUser(token: string) {
    const userResponse = await fetch('https://discord.com/api/users/@me', {
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

  // @ts-ignore:
  async getAccessToken(code: string, callbackUrl: string): Promise<{
    accessToken: string
    refreshToken: string
    expiresIn: number
    scope: string[]
    type: string
  } | undefined> {
    const body = new FormData()

    body.set('client_id', this.#clientId)
    body.set('client_secret', this.#clientSecret)
    body.set('code', code)
    body.set('grant_type', 'authorization_code')
    body.set('redirect_uri', callbackUrl)

    const response = await fetch('https://discord.com/api/oauth2/token', {
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
      scope: result.scope.split(' '),
      type: result.token_type
    }
  }
}
