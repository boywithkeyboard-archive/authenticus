import { AuthenticusError, PresetWithCredentials } from './_utils.ts'

type GetTokenOptions<
  P extends PresetWithCredentials,
> =
  & {
    code: string
    redirectUri: string
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
 * Retrieve an access token by a authorization code.
 *
 * @see https://www.oauth.com/oauth2-servers/access-tokens/authorization-code-request
 * @throws if the status code of the response is `4xx`.
 */
export async function getToken<
  P extends PresetWithCredentials,
>(
  preset: P,
  options: GetTokenOptions<P>,
): Promise<{
  accessToken: string
  refreshToken: string | undefined
  expiresIn: number
  refreshTokenExpiresIn: number | undefined
  scopes: string[] | undefined
  type: string | undefined
}> {
  options.code = decodeURIComponent(options.code)

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
        redirect_uri: options.redirectUri,
        code: options.code,
        grant_type: 'authorization_code',
      }),
    })
  } else if (preset.contentType.tokenEndpoint === 'formdata') {
    const body = new FormData()

    body.set('client_id', client_id)
    body.set('client_secret', client_secret)
    body.set('code', options.code)
    body.set('grant_type', 'authorization_code')
    body.set('redirect_uri', options.redirectUri)

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
      code: options.code,
      grant_type: 'authorization_code',
      redirect_uri: options.redirectUri,
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
        scopes: d.scope instanceof Array
          ? d.scope
          : d.scope.includes(' ')
          ? d.scope.split(' ')
          : d.scope.includes(',')
          ? d.scope.split(',')
          : [d.scope],
      }),
    type: d.token_type,
  }
}
