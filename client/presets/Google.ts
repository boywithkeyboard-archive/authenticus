import { Preset } from '../Preset.ts'

export type GoogleUser = {
  id: string
  email: string
  verified_email: boolean
  name: string
  given_name: string
  family_name: string
  picture: string
  locale: string
}

/**
 * Check out [Google's Developer Portal](https://console.cloud.google.com/apis/dashboard) to learn more.
 * 
 * Default scopes:
   * - `https://www.googleapis.com/auth/userinfo.profile`
   * - `https://www.googleapis.com/auth/userinfo.email`
 */
export const Google = new Preset<
  GoogleUser,
  {
    prompt?: string
    redirect_uri: string
  },
  {
    picture_size?: number
  }
>('v1', {
  oauth2: {
    authorize_url: 'accounts.google.com/o/oauth2/v2/auth',
    user_url: 'www.googleapis.com/oauth2/v2/userinfo',
    token_url: 'oauth2.googleapis.com/token',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  },
  advanced: {
    authorize_endpoint_query: {
      include_granted_scopes: 'true'
    },
    get_detailed_user(_, d, o) {
      d.picture = d.picture.replace('=s96-c', `=s${o?.picture_size ?? 64}`)
  
      return d
    }
  }
})
