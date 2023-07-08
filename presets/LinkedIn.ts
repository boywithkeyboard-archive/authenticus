import { createPreset } from '../createPreset.ts'

export type LinkedInUser = {
  firstName: {
    localized: Record<string, string>
    preferredLocale: {
      country: string
      language: string
    }
  }
  lastName: {
    localized: Record<string, string>
    preferredLocale: {
      country: string
      language: string
    }
  }
  id: string
  email: string
}

/**
 * Check out [LinkedIn's Developer Portal](https://www.linkedin.com/developers/apps) to learn more.
 *
 * Default scopes:
 * - `r_liteprofile`
 * - `r_emailaddress`
 *
 * @since v1.0
 * @version July 2023
 */
export const LinkedIn = createPreset<
  LinkedInUser,
  {
    redirectUri: string
  }
>({
  authorizeUri: 'www.linkedin.com/oauth/v2/authorization',
  tokenUri: 'www.linkedin.com/oauth/v2/accessToken',
  userUri: `api.linkedin.com/v2/me?projection=(${
    [
      'id',
      'firstName',
      'lastName',
      'maidenName',
      'profilePicture(displayImage~:playableStreams)',
    ].join(',')
  })`,

  scopes: [
    'r_liteprofile',
    'r_emailaddress',
  ],

  contentType: {
    tokenEndpoint: 'query',
  },

  async getUser(token, data) {
    const emailResponse = await fetch(
      'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
      {
        headers: {
          accept: 'application/json',
          authorization: `Bearer ${token}`,
        },
      },
    )

    if (emailResponse.ok) {
      const emailResponseData = await emailResponse.json()

      data.email = emailResponseData.elements[0]['handle~'].emailAddress
    }

    return data as LinkedInUser
  },

  getNormalizedUser(user) {
    return {
      id: user.id,
      email: user.email,
      firstName: Object.values(user.firstName.localized)[0],
      lastName: Object.values(user.lastName.localized)[0],
      avatarUrl: null,
    }
  },
})
