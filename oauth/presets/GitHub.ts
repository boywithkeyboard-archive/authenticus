import type { Octokit } from 'octokit'
import { NormalizedUser, Preset, PresetOptions } from '../preset'

export type GitHubUser = Awaited<
  ReturnType<
    Octokit['rest']['users']['getAuthenticated']
  >
>['data']

/**
 * Check out [GitHub's Developer Portal](https://github.com/settings/developers) to learn more.
 * 
 * These are the **default scopes**:
 * - `read:user`
 * - `user:email`
 * 
 * *You can overwrite the default scopes by specifying others!*
 */
export class GitHub extends Preset<
  GitHubUser, {
    allowSignup?: boolean
  }
> {
  constructor(options: PresetOptions) {
    const { scopes, ...rest } = options

    super({
      ...rest,
      authorizeUri: 'github.com/login/oauth/authorize',
      tokenUri: 'github.com/login/oauth/access_token',
      userUri: 'api.github.com/user',
      scopes: scopes ?? [
        'read:user',
        'user:email',
      ],
      contentType: {
        tokenEndpoint: 'json'
      }
    })
  }

  normalizeUser(
    user: GitHubUser,
    options?: {
      avatarSize?: number
    }
  ): NormalizedUser {
    return {
      id: user.id.toString(),
      email: user.email ?? null,
      firstName: user.name ? (
        user.name.split(' ').length > 1
           ? user.name.split(' ')[0]
           : user.name
      ) : null,
      lastName: user.name ? (
        user.name.split(' ').length > 1
           ? user.name.split(' ')[0]
           : null
      ) : null,
      avatarUrl: `https://avatars.githubusercontent.com/u/${user.id}${options?.avatarSize ? `?size=${options.avatarSize}` : ''}`
    }
  }
}
