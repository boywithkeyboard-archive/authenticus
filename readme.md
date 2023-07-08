<div align='center'>
  <picture>
    <source media='(prefers-color-scheme: dark)' srcset='https://raw.githubusercontent.com/azurystudio/authenticus/dev/.github/authenticus_dark.svg' width='256px'>
    <source media='(prefers-color-scheme: light)' srcset='https://raw.githubusercontent.com/azurystudio/authenticus/dev/.github/authenticus_light.svg' width='256px'>
    <img src='https://raw.githubusercontent.com/azurystudio/authenticus/dev/.github/authenticus_light.svg' width='256px'>
  </picture>
  <br />
  <br>
  <h1>authenticus</h1>
</div>

<br>

### Presets

- [x] `Discord`
- [x] `GitHub`
- [x] `GitLab`
- [x] `Google`
- [x] `LinkedIn`
- [x] `Spotify`
- [x] `Twitch`

### Setup

- #### 🦕 Deno

  ```ts
  import {
    createAuthorizeUrl,
    getToken,
    getUser,
    GitHub,
    preset,
  } from 'https://deno.land/x/authenticus@v2.0.0/mod.ts'
  ```

- #### 🐢 Node.js

  ```bash
  npm i authenticus
  ```

  ```ts
  import {
    createAuthorizeUrl,
    getToken,
    getUser,
    GitHub,
    preset,
  } from 'authenticus'

  // CommonJS
  const { GitHub, createAuthorizeUrl, getToken, getUser, preset } = require(
    'authenticus',
  )
  ```

### Usage

1. Create a Authorization URL

   ```ts
   const url = createAuthorizeUrl(GitHub, {
     clientId: '...',
     scopes: ['read:user', 'user:email'], // optional
     allowSignup: true,
   })
   ```

1. Retrieve an Access Token

   ```ts
   const { accessToken } = await getToken(GitHub, {
     clientId: '...',
     clientSecret: '...',
     code: '...', // part of the query string of the callback request
     redirectUri: 'https://example.com/oauth2/callback',
   })
   ```

1. Retrieve the User

   ```ts
   const user = await getUser(GitHub, accessToken)

   // Retrieve a normalized user:
   const normalized = await getNormalizedUser(GitHub, user)
   ```

#### Alternatively, you can specify the Client Secret and Client ID ahead of time:

1. Configure the preset.

   ```ts
   const gh = preset({
     ...GitHub,
     clientId: '...',
     clientSecret: '...',
   })
   ```

2. Create a Authorization URL

   ```ts
   const url = createAuthorizeUrl(gh, {
     scopes: ['read:user', 'user:email'], // optional
     allowSignup: true,
   })
   ```

3. Retrieve an Access Token

   ```ts
   const { accessToken } = await getToken(gh, {
     code: '...', // part of the query string of the callback request
     redirectUri: 'https://example.com/oauth2/callback',
   })
   ```

4. Retrieve the User

   ```ts
   const user = await getUser(gh, accessToken)

   // Retrieve a normalized user:
   const normalized = await getNormalizedUser(gh, user)
   ```

### Known "Issues"

If you want to get the user for Twitch, you'll need to provide the `clientId` in
the function or set it beforehand.

```ts
// a)
const user = await getUser(GitHub, accessToken, { clientId: '...' })

// b)
const user = await getUser(gh, accessToken)
```
