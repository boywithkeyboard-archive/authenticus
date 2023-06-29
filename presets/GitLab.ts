import { createPreset } from '../createPreset.ts'

export type GitLabUser = {
  id: number
  username: string
  name: string
  state: string
  avatar_url: string
  web_url: string
  created_at: string
  bio: string
  location: string
  public_email: string | null
  skype: string
  linkedin: string
  twitter: string
  discord: string
  website_url: string
  organization: string
  job_title: string
  pronouns: string | null
  bot: boolean
  work_information: string | null
  local_time: string | null
  last_sign_in_at: string
  confirmed_at: string
  last_activity_on: string
  email: string
  theme_id: number
  color_scheme_id: number
  projects_limit: number
  current_sign_in_at: string
  identities: {
    provider: string
    extern_uid: string
    saml_provider_id: number | null
  }[]
  can_create_group: boolean
  can_create_project: boolean
  two_factor_enabled: boolean
  external: boolean
  private_profile: boolean
  commit_email: string
  shared_runners_minutes_limit: number | null
  extra_shared_runners_minutes_limit: number | null
}

/**
 * Check out [GitLab's Developer Portal](https://gitlab.com/-/profile/applications) to learn more.
 *
 * Default scopes:
 * - `read_user`
 * - `profile`
 * - `email`
 */
export const GitLab = createPreset<
  GitLabUser,
  {
    redirectUri: string
  }
>({
  authorizeUri: 'gitlab.com/oauth/authorize',
  userUri: 'gitlab.com/api/v4/user',
  tokenUri: 'gitlab.com/oauth/token',

  scopes: [
    'read_user',
    'email',
    'profile',
  ],

  contentType: {
    tokenEndpoint: 'formdata',
  },

  getNormalizedUser(user) {
    return {
      id: user.id.toString(),
      email: user.email,
      firstName: user.name.includes(' ') ? user.name.split(' ')[0] : user.name,
      lastName: user.name.includes(' ') ? user.name.split(' ')[1] : null,
      avatarUrl: user.avatar_url,
    }
  },
})
