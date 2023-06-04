import { stringifyQuery } from 'https://gist.githubusercontent.com/boywithkeyboard/4873e54415ac365a84d05107c5c436b8/raw/faa69f55abf99a1f8452b1f9d3b9fe703a0475be/stringifyQuery.ts'

/**
 * Check out LinkedIn's Developer Portal [here](https://www.linkedin.com/developers/apps).
 */
export class LinkedIn {
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
   * - `r_basicprofile`
   * - `r_emailaddress`
   */
  getRedirectUrl({
    scope = ['r_liteprofile', 'r_emailaddress'],
    callbackUrl,
    state
  }: {
    scope?: string[]
    callbackUrl?: string
    state?: string
  }) {
    return `https://www.linkedin.com/oauth/v2/authorization?${
      stringifyQuery({
        client_id: this.#clientId,
        scope: scope.join(' '),
        redirect_uri: callbackUrl,
        response_type: 'code',
        ...(state && { state })
      })
    }`
  }

  async getUser(token: string, options?: {
    /**
     * When enabled, it attempts to retrieve the user's email.
     */
    email: boolean
  // deno-lint-ignore no-explicit-any
  }): Promise<{ id: string, email: string, [key: string]: any } | undefined> {
    const userResponse = await fetch(`https://api.linkedin.com/v2/me?projection=(${
      [
        'id',
        'firstName',
        'lastName',
        'maidenName',
        'profilePicture(displayImage~:playableStreams)'
      ].join(',')
    })`, {
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${token}`
      }
    })

    if (!userResponse.ok)
      return

    const data = await userResponse.json()

    if (!options?.email)
      return data

    const emailResponse = await fetch('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${token}`
      }
    })

    if (emailResponse.ok) {
      const emailResponseData = await emailResponse.json()

      data.email = emailResponseData.elements[0]['handle~'].emailAddress
    }

    return data
  }

  async getAccessToken(code: string, callbackUrl: string): Promise<{
    accessToken: string
    refreshToken: string | undefined
    expiresIn: number
    refreshTokenExpiresIn: number | undefined
    scope: string[]
  } | undefined> {
    const response = await fetch(`https://www.linkedin.com/oauth/v2/accessToken?${
      stringifyQuery({
        client_id: this.#clientId,
        client_secret: this.#clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: callbackUrl
      })
    }`, {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        accept: 'application/json'
      }
    })

    const result = await response.json()

    return {
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
      expiresIn: result.expires_in,
      refreshTokenExpiresIn: result.refresh_token_expires_in,
      scope: result.scope.split(',')
    }
  }
}
