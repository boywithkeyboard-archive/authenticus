import { AuthenticusError, PresetWithCredentials } from './_utils.ts'

type RefreshTokenOptions<
  P extends PresetWithCredentials,
> =
  & {
    refreshToken: string
  }
  & (P['clientId'] extends string ? {
      clientId?: string
    }
    : {
      clientId: string
    })
  & (P['clientSecret'] extends string ? {
      clientSecret?: string
    }
    : {
      clientSecret: string
    })

/**
 * Retrieve an access token by a refresh token.
 *
 * @see https://www.oauth.com/oauth2-servers/access-tokens/refreshing-access-tokens
 * @throws if the status code of the response is `4xx`.
 */
export async function refreshToken<
  P extends PresetWithCredentials,
>(
  preset: P,
  options: RefreshTokenOptions<P>,
): Promise<{
  accessToken: string
  refreshToken: string | undefined
  expiresIn: number
  refreshTokenExpiresIn: number | undefined
  scopes: string[] | undefined
  type: string | undefined
}> {
  let res: Response

  const client_id = (options.clientId ?? preset.clientId) as string
  const client_secret = (options.clientSecret ?? preset.clientSecret) as string

  if (preset.contentType.tokenEndpoint === 'json') {
    res = await fetch(preset.tokenUri, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        client_id,
        client_secret,
        refreshToken: options.refreshToken,
        grant_type: 'refresh_token',
      }),
    })
  } else if (preset.contentType.tokenEndpoint === 'formdata') {
    const body = new FormData()

    body.set('client_id', client_id)
    body.set('client_secret', client_secret)
    body.set('refresh_token', options.refreshToken)
    body.set('grant_type', 'refresh_token')

    res = await fetch(preset.tokenUri, {
      method: 'POST',
      headers: {
        accept: 'application/json',
      },
      body,
    })
  } else {
    const qs = new URLSearchParams({
      ...(preset.contentType.tokenEndpoint === 'query' && {
        client_id,
        client_secret,
      }),
      refresh_token: options.refreshToken,
      grant_type: 'refresh_token',
    })

    res = await fetch(`${preset.tokenUri}?${qs.toString()}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        accept: 'application/json',
        ...(preset.contentType.tokenEndpoint === 'query+header' && {
          authorization: `Basic ${btoa(`${client_id}:${client_secret}`)}`,
        }),
      },
    })
  }

  if (!res.ok) {
    throw new AuthenticusError(JSON.stringify({
      method: 'getToken',
      response: await res.json(),
      statusCode: res.status,
    }))
  }

  const d = await res.json()

  return {
    accessToken: d.access_token,
    refreshToken: d.refresh_token,
    expiresIn: d.expires_in,
    refreshTokenExpiresIn: d.refresh_token_expires_in,
    ...(d.scope &&
      {
        scopes: d.scope.includes(' ')
          ? d.scope.split(' ')
          : d.scope.includes(',')
          ? d.scope.split(',')
          : [d.scope],
      }),
    type: d.token_type,
  }
}
