import { NormalizedUser, PresetWithCredentials } from './_utils.ts'

/**
 * Retrieve the current user (normalized) based on an access token.
 *
 * @throws if the status code of the response is `4xx`.
 */
export function getNormalizedUser<
  P extends PresetWithCredentials,
>(
  preset: P,
  data: P['__user'],
  options?: { avatarSize?: number },
): NormalizedUser {
  return preset.getNormalizedUser(data, options) as NormalizedUser
}
