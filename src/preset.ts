export type PresetOptions = {
  clientId: string
  clientSecret: string
  scopes?: string[]
}

export type NormalizedUser = {
  id: string
  email: string | null
  firstName: string | null
  lastName: string | null
  avatarUrl: string | null
}

const camelToSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)

export class AuthenticusError extends Error {}

export class GetTokenError extends AuthenticusError {}
export class RefreshTokenError extends AuthenticusError {}
export class GetUserError extends AuthenticusError {}
export class CreateAuthorizeUriError extends AuthenticusError {}

export abstract class Preset<
  User extends Record<string, any> = Record<string, unknown>,
  CreateAuthorizeUriOptions extends Record<string, any> = {}
> {
  #options

  constructor(options: PresetOptions & {
    scopes: string[]
    authorizeUri: string
    tokenUri: string
    userUri: string
    contentType: {
      tokenEndpoint:
        | 'formdata'
        | 'json'
        | 'query'
        | 'query+header'
    }
    scopeJoinCharacter?: string
    queryParameters?: {
      authorizeEndpoint: Record<string, unknown>
    }
  }) {
    this.#options = options

    this.#options.authorizeUri = `https://${this.#options.authorizeUri}`
    this.#options.tokenUri = `https://${this.#options.tokenUri}`
    this.#options.userUri = `https://${this.#options.userUri}`
  }

  createAuthorizeUri(options: {
    state: string
  } & CreateAuthorizeUriOptions = {} as any): string {
    if (this.#options.queryParameters?.authorizeEndpoint !== undefined)
      options = Object.assign(options, this.#options.queryParameters.authorizeEndpoint)
  
    if (typeof this.#options.clientId === 'string')
      // @ts-ignore
      options.client_id = this.#options.clientId
  
    // @ts-ignore
    options.scope = this.#options.scopes.join(this.#options.scopeJoinCharacter ?? ' ')
  
    // @ts-ignore
    options = Object.fromEntries(
      Object.entries(options).map(([key, value]) => {
        return [camelToSnakeCase(key), value]
      })
    )
  
    // @ts-ignore
    options.response_type = 'code'
  
    const qs = new URLSearchParams(
      // @ts-ignore
      Object.entries(options)
        .filter(([_key, value]) => value !== null && value !== undefined)
        .map(([key, value]) => {
          if (
            typeof value !== 'string' &&
            typeof value !== 'number' &&
            typeof value !== 'boolean'
          )
            throw new CreateAuthorizeUriError(JSON.stringify({
              method: 'createAuthorizeUrl',
              message: `Invalid ${typeof value} value in query string.`
            }))
  
          return [
            key,
            typeof value === 'string' ? value : `${value}`
          ]
        })
    ).toString()
  
    return `${this.#options.authorizeUri}?${qs}`.replaceAll('%2B', '+')
  }

  async getToken(options: {
    code: string
    redirectUri: string
  }): Promise<{
    accessToken: string
    refreshToken: string | undefined
    expiresIn: number
    refreshTokenExpiresIn: number | undefined
    scopes: string[] | undefined
    type: string | undefined
  }> {
    options.code = decodeURIComponent(options.code)

    let res: Response

    const client_id = (this.#options.clientId ?? this.#options.clientId) as string
    , client_secret = (this.#options.clientSecret ?? this.#options.clientSecret) as string

    if (this.#options.contentType.tokenEndpoint === 'json') {
      res = await fetch(this.#options.tokenUri, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          accept: 'application/json'
        },
        body: JSON.stringify({
          client_id,
          client_secret,
          redirect_uri: options.redirectUri,
          code: options.code,
          grant_type: 'authorization_code'
        })
      })
    } else if (this.#options.contentType.tokenEndpoint === 'formdata') {
      const body = new FormData()

      body.set('client_id', client_id)
      body.set('client_secret', client_secret)
      body.set('code', options.code)
      body.set('grant_type', 'authorization_code')
      body.set('redirect_uri', options.redirectUri)

      res = await fetch(this.#options.tokenUri, {
        method: 'POST',
        headers: {
          accept: 'application/json'
        },
        body
      })
    } else {
      const qs = new URLSearchParams({
        ...(this.#options.contentType.tokenEndpoint === 'query' && {
          client_id,
          client_secret
        }),
        code: options.code,
        grant_type: 'authorization_code',
        redirect_uri: options.redirectUri
      })

      res = await fetch(`${this.#options.tokenUri}?${qs.toString()}`, {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          accept: 'application/json',
          ...(this.#options.contentType.tokenEndpoint === 'query+header' && {
            authorization: `Basic ${btoa(`${client_id}:${client_secret}`)}`
          })
        }
      })
    }

    if (!res.ok)
      throw new GetTokenError(JSON.stringify({
        method: 'getToken',
        response: await res.json(),
        statusCode: res.status
      }))

    const d = await res.json() as any

    return {
      accessToken: d.access_token,
      refreshToken: d.refresh_token,
      expiresIn: d.expires_in,
      refreshTokenExpiresIn: d.refresh_token_expires_in,
      ...(d.scope &&
        {
          scopes: d.scope instanceof Array
            ? d.scope
            : d.scope.includes(' ')
            ? d.scope.split(' ')
            : d.scope.includes(',')
            ? d.scope.split(',')
            : [d.scope]
        }),
      type: d.token_type
    }
  }

  async refreshToken(refreshToken: string): Promise<{
    accessToken: string
    refreshToken: string | undefined
    expiresIn: number
    refreshTokenExpiresIn: number | undefined
    scopes: string[] | undefined
    type: string | undefined
  }> {
    let res: Response

    const client_id = this.#options.clientId
    , client_secret = this.#options.clientSecret

    if (this.#options.contentType.tokenEndpoint === 'json') {
      res = await fetch(this.#options.tokenUri, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          accept: 'application/json'
        },
        body: JSON.stringify({
          client_id,
          client_secret,
          refresh_token: refreshToken,
          grant_type: 'refresh_token'
        })
      })
    } else if (this.#options.contentType.tokenEndpoint === 'formdata') {
      const body = new FormData()

      body.set('client_id', client_id)
      body.set('client_secret', client_secret)
      body.set('refresh_token', refreshToken)
      body.set('grant_type', 'refresh_token')

      res = await fetch(this.#options.tokenUri, {
        method: 'POST',
        headers: {
          accept: 'application/json'
        },
        body
      })
    } else {
      const qs = new URLSearchParams({
        ...(this.#options.contentType.tokenEndpoint === 'query' && {
          client_id,
          client_secret
        }),
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      })

      res = await fetch(`${this.#options.tokenUri}?${qs.toString()}`, {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          accept: 'application/json',
          ...(this.#options.contentType.tokenEndpoint === 'query+header' && {
            authorization: `Basic ${btoa(`${client_id}:${client_secret}`)}`
          })
        }
      })
    }

    if (!res.ok)
      throw new RefreshTokenError(JSON.stringify({
        method: 'getToken',
        response: await res.json(),
        statusCode: res.status
      }))

    const d = await res.json() as Record<string, any>

    return {
      accessToken: d.access_token,
      refreshToken: d.refresh_token,
      expiresIn: d.expires_in,
      refreshTokenExpiresIn: d.refresh_token_expires_in,
      ...(d.scope &&
        {
          scopes: d.scope.includes(' ')
            ? d.scope.split(' ')
            : d.scope.includes(',')
            ? d.scope.split(',')
            : [d.scope]
        }),
      type: d.token_type
    }
  }

  async getUser(token: string): Promise<User> {
    const res = await fetch(this.#options.userUri, {
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${token}`,
        'Client-Id': this.#options.clientId
      }
    })
  
    if (!res.ok)
      throw new GetUserError(JSON.stringify({
        method: 'getUser',
        response: await res.json(),
        statusCode: res.status
      }))
  
    return await res.json() as User
  }

  abstract normalizeUser(
    user: User,
    options?: {
      avatarSize?: number
    }
  ): NormalizedUser
}
