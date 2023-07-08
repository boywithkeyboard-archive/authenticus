import { AuthenticusError } from '../_utils.ts'
import { createPreset } from '../createPreset.ts'

export type GitHubUser = {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
  name: string
  company: string
  blog: string
  location: string | null
  email: string
  hireable: boolean
  bio: string | null
  twitter_username: string | null
  public_repos: number
  public_gists: number
  followers: number
  following: number
  created_at: string
  updated_at: string
  private_gists: number
  total_private_repos: number
  owned_private_repos: number
  disk_usage: number
  collaborators: number
  two_factor_authentication: boolean
  plan: {
    name: string
    space: number
    collaborators: number
    private_repos: number
  }
  emails: {
    email: string
    primary: boolean
    verified: boolean
    visibility: string | null
  }[]
}

/**
 * Check out [GitHub's Developer Portal](https://github.com/settings/developers) to learn more.
 *
 * Default scopes:
 * - `read:user`
 * - `user:email`
 *
 * @since v1.0
 * @version July 2023
 */
export const GitHub = createPreset<
  GitHubUser,
  {
    allowSignup?: boolean
  }
>({
  authorizeUri: 'github.com/login/oauth/authorize',
  tokenUri: 'github.com/login/oauth/access_token',
  userUri: 'api.github.com/user',

  scopes: [
    'read:user',
    'user:email',
  ],

  async getUser(token, data) {
    const res = await fetch(
      'https://api.github.com/user/emails',
      {
        headers: {
          accept: 'application/json',
          authorization: `Bearer ${token}`,
        },
      },
    )

    if (!res.ok) {
      throw new AuthenticusError(JSON.stringify({
        method: 'getUser',
        response: await res.json(),
        statusCode: res.status,
      }))
    }

    const emails = await res.json()

    data.emails = emails
    data.email = (emails.find((e: { primary: boolean }) =>
      e.primary
    ) ?? emails[0])
      .email

    return data as GitHubUser
  },

  getNormalizedUser(user, options) {
    const avatarUrl = new URL(user.avatar_url)

    avatarUrl.searchParams.set('size', `${options?.avatarSize ?? 64}`)

    return {
      id: user.id.toString(),
      email: user.email,
      firstName: user.name.includes(' ') ? user.name.split(' ')[0] : user.name,
      lastName: user.name.includes(' ') ? user.name.split(' ')[1] : null,
      avatarUrl: avatarUrl.toString(),
    }
  },
})
