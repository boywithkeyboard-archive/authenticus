import { Preset } from '../Preset.ts'

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
 */
export const LinkedIn = new Preset<
  LinkedInUser,
  {
    redirect_uri: string
  }
>(
  'v1',
  {
    oauth2: {
      authorize_url: 'www.linkedin.com/oauth/v2/authorization',
      user_url: `api.linkedin.com/v2/me?projection=(${
        [
          'id',
          'firstName',
          'lastName',
          'maidenName',
          'profilePicture(displayImage~:playableStreams)',
        ].join(',')
      })`,
      token_url: 'www.linkedin.com/oauth/v2/accessToken',
      scope: [
        'r_liteprofile',
        'r_emailaddress',
      ],
    },
    advanced: {
      token_endpoint_type: 'query',
      async get_detailed_user(t, d) {
        const emailResponse = await fetch(
          'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
          {
            headers: {
              accept: 'application/json',
              authorization: `Bearer ${t}`,
            },
          },
        )

        if (emailResponse.ok) {
          const emailResponseData = await emailResponse.json()

          d.email = emailResponseData.elements[0]['handle~'].emailAddress
        }

        return d
      },
    },
  },
)
