import { Preset } from '../Preset.ts'

export const Discord: Preset = [
  'discord',
  {
    authorize_hostname: 'discord.com',
    authorize_pathname: '/api/oauth2/authorize',
    token_hostname: 'discord.com',
    token_pathname: '/api/oauth2/token'
  }
]
