import { Preset } from './createPreset.ts'

export function preset<
  P extends // deno-lint-ignore no-explicit-any
  (Preset<any, any> & { clientId: string; clientSecret: string }),
>(preset: P) {
  return preset
}
