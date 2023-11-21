import { Preset, PresetOptions } from '../preset'

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
 * These are the **default scopes**:
 * - `https://www.googleapis.com/auth/userinfo.profile`
 * - `https://www.googleapis.com/auth/userinfo.email`
 * 
 * *You can overwrite the default scopes by specifying others!*
 * 
 * ***Please set both `prompt` and `accessType` when calling `createAuthorizeUri()` if you want to receive a refresh token.***
 */
export class Google extends Preset<
  GoogleUser, {
    prompt?: 'consent'
    accessType?: 'offline'
    redirectUri: string
  }
> {
  constructor(options: PresetOptions) {
    const { scopes, ...rest } = options

    super({
      ...rest,
      authorizeUri: 'accounts.google.com/o/oauth2/v2/auth',
      tokenUri: 'oauth2.googleapis.com/token',
      userUri: 'www.googleapis.com/oauth2/v2/userinfo',
      scopes: scopes ?? [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
      contentType: {
        tokenEndpoint: 'formdata'
      },
      scopeJoinCharacter: '+',
      queryParameters: {
        authorizeEndpoint: {
          include_granted_scopes: true
        }
      }
    })
  }

  normalizeUser(
    user: GoogleUser,
    options?: {
      avatarSize?: number
    }
  ) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.given_name,
      lastName: user.family_name,
      avatarUrl: user.picture.replace(
        '=s96-c',
        `=s${options?.avatarSize ?? 64}`
      )
    }
  }
}
