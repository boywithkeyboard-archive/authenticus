import { NormalizedUser } from './NormalizedUser.ts'

export type Preset<User, TokenEndpointOptions> = {
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
}

export function createPreset<
  User extends Record<string, unknown>,
  TokenEndpointOptions extends { [key: string]: unknown } = {
    [key: string]: unknown
  },
>({
  authorizeUri,
  tokenUri,
  userUri,
  scopes,
  contentType,
  queryParameters,
  scopeJoinCharacter,
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
}): Preset<User, TokenEndpointOptions> {
  return {
    authorizeUri: `https://${authorizeUri}`,
    tokenUri: `https://${tokenUri}`,
    userUri: `https://${userUri}`,
    scopes,
    contentType: contentType ?? {
      tokenEndpoint: 'json',
    },
    queryParameters: {
      authorizeEndpoint: queryParameters?.authorizeEndpoint,
    },
    scopeJoinCharacter: scopeJoinCharacter ?? ' ',
    getNormalizedUser,
    getUser,
  } as Preset<User, TokenEndpointOptions>
}
