import { Preset } from './createPreset.ts'

export class AuthenticusError extends Error {}

// deno-lint-ignore no-explicit-any
export type PresetWithCredentials = Preset<any, any, any> & {
  clientId?: string
  clientSecret?: string
}

export type NormalizedUser = {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  avatarUrl: string | null
}
