import { PresetWithCredentials } from './_utils.ts'

export function preset<
  P extends PresetWithCredentials,
>(preset: P) {
  return preset
}
