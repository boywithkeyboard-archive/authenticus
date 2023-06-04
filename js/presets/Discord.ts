import { stringifyQuery } from 'https://gist.githubusercontent.com/boywithkeyboard/4873e54415ac365a84d05107c5c436b8/raw/faa69f55abf99a1f8452b1f9d3b9fe703a0475be/stringifyQuery.ts'
import { Preset } from '../Preset.ts'

export class Discord implements Preset {
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

  getRedirectUrl({
    scope = ['identify'],
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
        authorization: `bearer ${token}`
      }
    })

    // deno-lint-ignore no-explicit-any
    , data: Record<string, any> = await userResponse.json()

    return data
  }

  async getAccessToken(code: string): Promise<{
    accessToken: string
    scope: string
    type: string
  } | undefined> {
    const body = new FormData()

    body.set('client_id', this.#clientId)
    body.set('client_secret', this.#clientSecret)
    body.set('code', code)
    body.set('grant_type', 'authorization_code')

    const response = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        accept: 'application/json'
      },
      body
    })

    , result = await response.json()

    console.log(result)

    return !response.ok ? undefined : {
      accessToken: result.access_token,
      scope: result.scope,
      type: result.token_type
    }
  }
}
