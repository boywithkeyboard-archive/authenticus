import { Preset } from './Preset.ts'

export type GitHubUser = {}

type Custom = {
  getAuthorizeUrl: {
    allow_signup?: boolean
  }
  getUser: {
    [key: string]: never
  }
}

/**
 * Check out [GitHub's Developer Portal](https://github.com/settings/developers) to learn more.
 * 
 * Default scopes:
   * - `read:user`
   * - `user:email`
 */
export const GitHub = new Preset<GitHubUser, Custom>({
  authorizeUrl: 'github.com/login/oauth/authorize',
  userUrl: 'api.github.com/user',
  tokenUrl: 'github.com/login/oauth/access_token',
  scopeSplitCharacter: ',',
  defaultScope: [
    'read:user',
    'user:email'
  ],
  async afterGetUser(token, data) {
    const emailResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${token}`
      }
    })
    
    const emails = await emailResponse.json()

    data.emails = emails
    // deno-lint-ignore no-explicit-any
    data.email = (emails.find((e: any) => e.primary) ?? emails[0]).email

    return data
  }
})
