import { Preset } from './Preset.ts'

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

type Custom = {
  getAuthorizeUrl: {
    prompt?: string
  }
  getUser: {
    profilePictureSize?: number
  }
}

/**
 * Check out [Google's Developer Portal](https://gitlab.com/-/profile/applications) to learn more.
 * 
 * Default scopes:
   * - `https://www.googleapis.com/auth/userinfo.profile`
   * - `https://www.googleapis.com/auth/userinfo.email`
 */
export const Google = new Preset<GoogleUser, Custom>({
  authorizeUrl: 'accounts.google.com/o/oauth2/v2/auth',
  userUrl: 'www.googleapis.com/oauth2/v2/userinfo',
  tokenUrl: 'oauth2.googleapis.com/token',
  defaultScope: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ],
  getAuthorizeUrlQueryParameters: {
    include_granted_scopes: 'true'
  },
  afterGetUser(_token, data, options) {
    data.picture = data.picture.replace('=s96-c', `=s${options?.profilePictureSize ?? 64}`)

    return data
  }
})
