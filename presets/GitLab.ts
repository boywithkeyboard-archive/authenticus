import { Preset } from '../Preset.ts'

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
export const GitLab = new Preset<
  GitLabUser,
  {
    redirect_uri: string
  }
>(
  'v1',
  {
    oauth2: {
      authorize_url: 'gitlab.com/oauth/authorize',
      user_url: 'gitlab.com/api/v4/user',
      token_url: 'gitlab.com/oauth/token',
      scope: [
        'read_user',
        'email',
        'profile',
      ],
    },
    advanced: {
      token_endpoint_type: 'formdata',
    },
  },
)
