import { Preset } from '../Preset.ts'

export const Spotify: Preset = [
  'spotify',
  {
    authorize_hostname: 'accounts.spotify.com',
    authorize_pathname: '/authorize',
    token_hostname: 'accounts.spotify.com',
    token_pathname: '/api/token'
  }
]
