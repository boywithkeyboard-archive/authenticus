import { AuthenticusError, PresetWithCredentials } from './_utils.ts'
import { Preset } from './createPreset.ts'

export function getUser<
  // deno-lint-ignore no-explicit-any
  P extends Preset<any, any, never> & {
    clientId?: string | undefined
    clientSecret?: string | undefined
  },
>(
  preset: P,
  token: string,
): Promise<P['__user']>

export function getUser<
  P extends PresetWithCredentials,
>(
  preset: P,
  token: string,
  options: P['__userEndpointOptions'],
): Promise<P['__user']>

/**
 * Retrieve the current user based on an access token.
 *
 * @throws If the status code of the response is `4xx`, this function throws an error containing the response body.
 */
export async function getUser<
  P extends PresetWithCredentials,
>(
  preset: P,
  token: string,
  options?: P['__userEndpointOptions'],
): Promise<P['__user']> {
  const res = await fetch(preset.userUri, {
    headers: {
      accept: 'application/json',
      authorization: `Bearer ${token}`,
      ...(options?.clientId ||
        preset.clientId &&
          { 'Client-Id': preset.clientId ?? options?.clientId }),
    },
  })

  if (!res.ok) {
    throw new AuthenticusError(JSON.stringify({
      method: 'getUser',
      response: await res.json(),
      statusCode: res.status,
    }))
  }

  let data = await res.json()

  if (preset.getUser) {
    data = preset.getUser(token, data)
  }

  return data
}
