import { AuthenticusError, PresetWithCredentials } from './_utils.ts'

const camelToSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)

/**
 * Create an authorization URL to start the OAuth 2.0 login process.
 *
 * @throws if it fails to parse the query parameters.
 */
export function createAuthorizeUrl<
  P extends PresetWithCredentials,
>(
  preset: P,
  opts:
    // deno-lint-ignore ban-types
    & (P['clientId'] extends string ? {}
      : {
        clientId: string
      })
    & {
      scopes?: string[]
      state?: string
    }
    & P['__authorizeEndpointOptions'],
): string {
  if (preset.queryParameters.authorizeEndpoint !== undefined) {
    opts = Object.assign(opts, preset.queryParameters.authorizeEndpoint)
  }

  if (typeof preset.clientId === 'string') {
    opts.client_id = preset.clientId
  }

  opts.scopes = [
    ...((opts.scopes as string[] | undefined) ?? []),
    ...preset.scopes,
  ]

  opts = Object.fromEntries(
    Object.entries(opts).map(([key, value]) => {
      return [camelToSnakeCase(key), value]
    }),
    // deno-lint-ignore no-explicit-any
  ) as any

  opts.scope = (opts.scopes as string[]).join(preset.scopeJoinCharacter ?? ' ')

  delete opts.scopes

  opts.response_type = 'code'

  const qs = new URLSearchParams(
    Object.entries(opts)
      .filter(([_key, value]) => value !== null && value !== undefined)
      .map(([key, value]) => {
        if (
          typeof value !== 'string' &&
          typeof value !== 'number' &&
          typeof value !== 'boolean'
        ) {
          throw new AuthenticusError(JSON.stringify({
            method: 'createAuthorizeUrl',
            message: `Invalid ${typeof value} value in query string.`,
          }))
        }

        return [
          key,
          typeof value === 'string' ? value : `${value}`,
        ]
      }),
  ).toString()

  return `${preset.authorizeUri}?${qs}`.replaceAll('%2B', '+')
}
