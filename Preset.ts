class GetUserError extends Error {}
class GetAccessTokenError extends Error {}
class GetAuthorizeUrlError extends Error {}

type NormalizedUser = {
  id: string
  nickname: string
  firstName: string
  lastName: string
  avatar: string
  email: string
}

export class Preset<
  User = Record<string, unknown>,
  GetAuthorizeOptions extends { [key: string]: unknown } = {
    [key: string]: unknown
  },
  GetUserOptions extends { [key: string]: unknown } = { [key: string]: never },
> {
  #authorizeUrl
  #tokenUrl
  #userUrl
  #scopes
  #joiner
  #getAccessTokenContentType
  #getAuthorizeUrlQueryParameters
  #afterGetUser
  getNormalizedUser

  constructor(_version: 'v1', {
    getNormalizedUser,
    oauth2,
    advanced: {
      scope_join_character,
      token_endpoint_type,
      get_detailed_user,
      authorize_endpoint_query,
    } = {},
  }: {
    getNormalizedUser: (token: string) => Promise<NormalizedUser>
    oauth2: {
      authorize_url: string
      token_url: string
      user_url: string
      scope: string[]
    }
    advanced?: {
      scope_join_character?: string
      /**
       * @deprecated authenticus determines that now internally.
       */
      scope_split_character?: string
      authorize_endpoint_query?: Record<string, unknown>
      token_endpoint_type?:
        | 'json'
        | 'formdata'
        | 'query'
        | 'query+header'
      // deno-lint-ignore no-explicit-any
      get_detailed_user?: (
        token: string,
        data: Record<string, any>,
        options: GetUserOptions | undefined,
      ) => Record<string, any> | Promise<Record<string, any>>
    }
  }) {
    this.getNormalizedUser = getNormalizedUser
    this.#authorizeUrl = `https://${oauth2.authorize_url}`
    this.#tokenUrl = `https://${oauth2.token_url}`
    this.#userUrl = `https://${oauth2.user_url}`
    this.#scopes = oauth2.scope
    this.#joiner = scope_join_character ?? ' '
    this.#getAccessTokenContentType = token_endpoint_type ?? 'json'
    this.#afterGetUser = get_detailed_user
    this.#getAuthorizeUrlQueryParameters = authorize_endpoint_query
  }

  /**
   * Create an authorization URL to start the OAuth 2.0 login process.
   */
  getAuthorizeUrl(
    options: {
      scope?: string[]
      client_id: string
      state?: string
    } & GetAuthorizeOptions,
  ) {
    if (this.#getAuthorizeUrlQueryParameters !== undefined) {
      Object.assign(options, this.#getAuthorizeUrlQueryParameters)
    }

    if (!options.scope) {
      options.scope = this.#scopes
    }

    // @ts-ignore:
    options.scope = options.scope.join(this.#joiner)

    // @ts-ignore:
    options.response_type = 'code'

    const qs = new URLSearchParams(
      Object.entries(options)
        .filter(([_key, value]) => value !== null && value !== undefined)
        .map(([key, value]) => {
          if (
            typeof value !== 'string' &&
            typeof value !== 'number' &&
            typeof value !== 'boolean'
          ) {
            throw new GetAuthorizeUrlError(
              `Invalid ${typeof value} value in query string.`,
            )
          }

          return [
            key,
            typeof value === 'string' ? value : `${value}`,
          ]
        }),
    ).toString()

    return `${this.#authorizeUrl}?${qs}`
  }

  /**
   * Retrieve the current user based on an access token.
   *
   * If the status code of the response is `4xx`, this function throws an error containing the response body.
   */
  async getUser(
    token: string,
    options?: GetUserOptions,
  ): Promise<User & { [key: string]: unknown }> {
    const response = await fetch(this.#userUrl, {
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new GetUserError(await response.text())
    }

    let data = await response.json()

    if (this.#afterGetUser) {
      data = this.#afterGetUser(token, data, options)
    }

    return data
  }

  /**
   * Retrieve an access token by the authorization code.
   *
   * If the status code of the response is `4xx`, this function throws an error containing the response body.
   */
  async getAccessToken({
    client_id,
    client_secret,
    code,
    redirect_uri,
  }: {
    client_id: string
    client_secret: string
    code: string
    redirect_uri: string
  }): Promise<{
    access_token: string
    refresh_token: string | undefined
    expires_in: number
    refresh_token_expires_in: number | undefined
    scope: string[] | undefined
    type: string | undefined
  }> {
    code = decodeURIComponent(code)

    let response: Response

    if (this.#getAccessTokenContentType === 'json') {
      response = await fetch(this.#tokenUrl, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify({
          client_id,
          client_secret,
          redirect_uri,
          code,
          grant_type: 'authorization_code',
        }),
      })
    } else if (this.#getAccessTokenContentType === 'formdata') {
      const body = new FormData()

      body.set('client_id', client_id)
      body.set('client_secret', client_secret)
      body.set('code', code)
      body.set('grant_type', 'authorization_code')
      body.set('redirect_uri', redirect_uri)

      response = await fetch(this.#tokenUrl, {
        method: 'POST',
        headers: {
          accept: 'application/json',
        },
        body,
      })
    } else {
      const qs = new URLSearchParams({
        ...(this.#getAccessTokenContentType === 'query' && {
          client_id,
          client_secret,
        }),
        code,
        grant_type: 'authorization_code',
        redirect_uri,
      })

      response = await fetch(`${this.#tokenUrl}?${qs.toString()}`, {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          accept: 'application/json',
          ...(this.#getAccessTokenContentType === 'query+header' && {
            authorization: `Basic ${btoa(`${client_id}:${client_secret}`)}`,
          }),
        },
      })
    }

    if (!response.ok) {
      throw new GetAccessTokenError(await response.text())
    }

    const data = await response.json()

    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
      refresh_token_expires_in: data.refresh_token_expires_in,
      ...(data.scope &&
        {
          scope: data.scope.includes(' ')
            ? data.scope.split(' ')
            : data.scope.includes(',')
            ? data.scope.split(',')
            : [data.scope],
        }),
      type: data.token_type,
    }
  }

  async refreshAccessToken() {
  }
}
