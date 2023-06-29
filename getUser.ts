import { Preset } from './createPreset.ts'

class GetUserError extends Error {}

/**
 * Retrieve the current user based on an access token.
 *
 * If the status code of the response is `4xx`, this function throws an error containing the response body.
 */
export async function getUser<
  // deno-lint-ignore no-explicit-any
  P extends (Preset<any, any> & { clientId?: string; clientSecret?: string }),
>(preset: P, token: string): Promise<P['__user']> {
  const response = await fetch(preset.userUri, {
    headers: {
      accept: 'application/json',
      authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new GetUserError(await response.text())
  }

  let data = await response.json()

  if (preset.getUser) {
    data = preset.getUser(token, data)
  }

  return data
}
