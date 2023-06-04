import { stringifyQuery } from 'https://gist.githubusercontent.com/boywithkeyboard/4873e54415ac365a84d05107c5c436b8/raw/faa69f55abf99a1f8452b1f9d3b9fe703a0475be/stringifyQuery.ts'
import { Preset } from '../Preset.ts'

export class GitHub implements Preset {
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
    scope = ['read:user'],
    allowSignUp = false
  }: {
    scope?: string[]
    allowSignUp?: boolean
  } = {}) {
    return `https://github.com/login/oauth/authorize?${
      stringifyQuery({
        client_id: this.#clientId,
        scope: scope.join(' '),
        allow_signup: allowSignUp
      })
    }`
  }

  async getUser(
    token: string,
    options?: {
      /**
       * When enabled, it attempts to retrieve the user's email.
       */
      email: boolean
    }
  ) {
    const headers = {
      accept: 'application/vnd.github.v3+json',
      authorization: `token ${token}`
    }

    , userResponse = await fetch('https://api.github.com/user', {
      headers
    })

    if (!userResponse.ok)
      return

    // deno-lint-ignore no-explicit-any
    const data: Record<string, any> = await userResponse.json()

    if (!options?.email || data.email)
      return data

    const emailResponse = await fetch('https://api.github.com/user/emails', {
      headers
    })

    , emails = await emailResponse.json()

    data.emails = emails
    // deno-lint-ignore no-explicit-any
    data.email = (emails.find((e: any) => e.primary) ?? emails[0]).email
    
    return data
  }

  async getAccessToken(code: string): Promise<{
    accessToken: string
    scope: string
    type: string
  } | undefined> {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json'
      },
      body: JSON.stringify({
        client_id: this.#clientId,
        client_secret: this.#clientSecret,
        code
      })
    })

    if (!response.ok)
      return

    const result = await response.json()

    return {
      accessToken: result.access_token,
      scope: result.scope,
      type: result.token_type
    }
  }
}
