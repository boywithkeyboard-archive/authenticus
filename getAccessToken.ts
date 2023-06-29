import { Preset } from './createPreset.ts'

class GetAccessTokenError extends Error {}

/**
 * Retrieve an access token by the authorization code.
 *
 * If the status code of the response is `4xx`, this function throws an error containing the response body.
 */
export async function getAccessToken<
  // deno-lint-ignore no-explicit-any
  P extends (Preset<any, any> & { clientId?: string; clientSecret?: string }),
>(
  preset: P,
  options: P['clientId'] extends string ? {
      code: string
      redirectUri: string
    }
    : {
      clientId: string
      clientSecret: string
      code: string
      redirectUri: string
    },
): Promise<{
  accessToken: string
  refreshToken: string | undefined
  expiresIn: number
  refreshTokenExpiresIn: number | undefined
  scopes: string[] | undefined
  type: string | undefined
}> {
  const code = decodeURIComponent(options.code)

  // @ts-ignore:
  const client_id = preset.clientId ?? options.clientId
  // @ts-ignore:
  const client_secret = preset.clientSecret ?? options.clientSecret

  let response: Response

  if (preset.contentType.tokenEndpoint === 'json') {
    response = await fetch(preset.tokenUri, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        client_id,
        client_secret,
        redirect_uri: options.redirectUri,
        code,
        grant_type: 'authorization_code',
      }),
    })
  } else if (preset.contentType.tokenEndpoint === 'formdata') {
    const body = new FormData()

    body.set('client_id', client_id)
    body.set('client_secret', client_secret)
    body.set('code', code)
    body.set('grant_type', 'authorization_code')
    body.set('redirect_uri', options.redirectUri)

    response = await fetch(preset.tokenUri, {
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
      code,
      grant_type: 'authorization_code',
      redirect_uri: options.redirectUri,
    })

    response = await fetch(`${preset.tokenUri}?${qs.toString()}`, {
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

  if (!response.ok) {
    throw new GetAccessTokenError(await response.text())
  }

  const data = await response.json()

  return {
    accessRoken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
    refreshTokenExpiresIn: data.refresh_token_expires_in,
    ...(data.scope &&
      {
        scopes: data.scope.includes(' ')
          ? data.scope.split(' ')
          : data.scope.includes(',')
          ? data.scope.split(',')
          : [data.scope],
      }),
    type: data.token_type,
  }
}
