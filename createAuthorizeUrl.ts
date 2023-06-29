import snakeCase from 'https://deno.land/x/case@2.1.1/snakeCase.ts'
import { Preset } from './createPreset.ts'

class CreateAuthorizeUrlError extends Error {}

/**
 * Create an authorization URL to start the OAuth 2.0 login process.
 */
export function createAuthorizeUrl<
  // deno-lint-ignore no-explicit-any
  P extends (Preset<any, any> & { clientId?: string; clientSecret?: string }),
>(
  preset: P,
  options:
    & (P['clientId'] extends string ? {
        scopes?: string[]
        state?: string
      }
      : {
        scopes?: string[]
        clientId: string
        state?: string
      })
    & P['__authorizeEndpointOptions'],
) {
  if (preset.queryParameters.authorizeEndpoint !== undefined) {
    Object.assign(options, preset.queryParameters.authorizeEndpoint)
  }

  if (typeof preset.clientId === 'string') {
    options.client_id = preset.clientId
  }

  if (!options.scope) {
    options.scope = preset.scopes
  }

  options = Object.fromEntries(
    Object.entries(options).map(([key, value]) => {
      return [snakeCase(key), value]
    }),
    // deno-lint-ignore no-explicit-any
  ) as any

  options.scope = options.scopes.join(preset.scopeJoinCharacter)

  options.response_type = 'code'

  const qs = new URLSearchParams(
    Object.entries(options)
      .filter(([_key, value]) => value !== null && value !== undefined)
      .map(([key, value]) => {
        if (
          typeof value !== 'string' &&
          typeof value !== 'number' &&
          typeof value !== 'boolean'
        ) {
          throw new CreateAuthorizeUrlError(
            `Invalid ${typeof value} value in query string.`,
          )
        }

        return [
          key,
          typeof value === 'string' ? value : `${value}`,
        ]
      }),
  ).toString()

  return `${preset.authorizeUri}?${qs}`
}
