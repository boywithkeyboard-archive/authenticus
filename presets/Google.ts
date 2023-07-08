import { createPreset } from '../createPreset.ts'

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
 *
 * @since v1.0
 * @version July 2023
 */
export const Google = createPreset<
  GoogleUser,
  {
    prompt?: string
    redirectUri: string
  }
>({
  authorizeUri: 'accounts.google.com/o/oauth2/v2/auth',
  tokenUri: 'oauth2.googleapis.com/token',
  userUri: 'www.googleapis.com/oauth2/v2/userinfo',

  scopes: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ],

  getNormalizedUser(user, options) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.given_name,
      lastName: user.family_name,
      avatarUrl: user.picture.replace(
        '=s96-c',
        `=s${options?.avatarSize ?? 64}`,
      ),
    }
  },
})
