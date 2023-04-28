import { Preset } from '../Preset.ts'

export const GitHub: Preset = [
  'github',
  {
    authorize_hostname: 'github.com',
    authorize_pathname: '/login/oauth/authorize',
    token_hostname: 'github.com',
    token_pathname: '/login/oauth/access_token'
  }
]
