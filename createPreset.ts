import { NormalizedUser } from './_utils.ts'

export type Preset<User, TokenEndpointOptions, UserEndpointOptions> = {
  authorizeUri: string
  tokenUri: string
  userUri: string
  scopes: string[]

  scopeJoinCharacter: string

  contentType: {
    tokenEndpoint: 'formdata' | 'json' | 'query' | 'query+header'
  }

  queryParameters: {
    authorizeEndpoint: Record<string, unknown> | undefined
  }

  getNormalizedUser: (
    user: User,
    options?: { avatarSize?: number },
  ) => NormalizedUser

  getUser?: (
    token: string,
    // deno-lint-ignore no-explicit-any
    data: Record<string, any>,
  ) => User | Promise<User>

  __user: User
  __authorizeEndpointOptions: TokenEndpointOptions
  __userEndpointOptions: UserEndpointOptions
}

export function createPreset<
  User extends Record<string, unknown>,
  TokenEndpointOptions extends { [key: string]: unknown } = {
    [key: string]: unknown
  },
  UserEndpointOptions extends { [key: string]: unknown } | never = never,
>({
  authorizeUri,
  tokenUri,
  userUri,
  scopes,
  contentType = {
    tokenEndpoint: 'json',
  },
  queryParameters = {
    authorizeEndpoint: undefined,
  },
  scopeJoinCharacter = ' ',
  getNormalizedUser,
  getUser,
}: {
  authorizeUri: string
  tokenUri: string
  userUri: string

  scopes: string[]

  /**
   * @default 'json'
   */
  contentType?: {
    tokenEndpoint: 'formdata' | 'json' | 'query' | 'query+header'
  }

  queryParameters?: {
    authorizeEndpoint?: Record<string, unknown>
  }

  scopeJoinCharacter?: string

  getNormalizedUser: (
    user: User,
    options?: { avatarSize?: number },
  ) => NormalizedUser

  getUser?: (
    token: string,
    // deno-lint-ignore no-explicit-any
    data: Record<string, any>,
  ) => User | Promise<User>
}): Preset<User, TokenEndpointOptions, UserEndpointOptions> {
  if (!authorizeUri.startsWith('http')) {
    authorizeUri = `https://${authorizeUri}`
  }

  if (!tokenUri.startsWith('http')) {
    tokenUri = `https://${tokenUri}`
  }

  if (!userUri.startsWith('http')) {
    userUri = `https://${userUri}`
  }

  return {
    authorizeUri,
    tokenUri,
    userUri,
    scopes,
    contentType,
    queryParameters,
    scopeJoinCharacter,
    getNormalizedUser,
    getUser,
  } as Preset<User, TokenEndpointOptions, UserEndpointOptions>
}
