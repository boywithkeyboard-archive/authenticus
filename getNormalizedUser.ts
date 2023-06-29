import { NormalizedUser } from './NormalizedUser.ts'
import { Preset } from './createPreset.ts'

class GetNormalizedUserError extends Error {}

export async function getNormalizedUser<
  // deno-lint-ignore no-explicit-any
  P extends (Preset<any, any> & { clientId?: string; clientSecret?: string }),
>(
  preset: P,
  token: string,
  options?: { avatarSize?: number },
): Promise<NormalizedUser> {
  const response = await fetch(preset.userUri, {
    headers: {
      accept: 'application/json',
      authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new GetNormalizedUserError(await response.text())
  }

  let data = await response.json()

  if (preset.getUser) {
    data = preset.getUser(token, data)
  }

  return preset.getNormalizedUser(data, options) as NormalizedUser
}
