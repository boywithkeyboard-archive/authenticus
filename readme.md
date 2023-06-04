## authenticus

### Introduction

> authenticus is an **oauth2 library** with a dozen templates that empower you to authenticate users against your app with *almost all major vendors*. It is available **for Deno, Node.js, and the browser**. Can't find the provider you're looking for? [Open an issue!](https://github.com/azurystudio/authenticus/issues/new/choose)

- [x] `Amazon`
- [x] `Apple`
- [x] `Discord`
- [x] `GitHub`
- [x] `GitLab`
- [x] `Google`
- [x] `LinkedIn`
- [x] `Microsoft`
- [x] `Spotify`

### Usage

<details open>
  <summary>🦕 <b>Deno</b></summary>
  
  ###

  ```ts
  import { GitHub } from 'https://deno.land/x/authenticus@v0.0.0/mod.ts'

  const github = new GitHub({
    clientId: '...',
    clientSecret: '...'
  })

  // #1 - Create a Redirect URL

  const redirectUrl = github.getRedirectUrl({
    scope: ['read:user', 'user:email'], // optional
    allowSignUp: true
  })

  // #2 - Retrieve an Access Token

  const { accessToken } = await github.getAccessToken('<code>')
  // (The code is included in the query string of the callback request.)

  // #3 - Retrieve the User

  const user = await github.getUser(accessToken)
  ```
</details>

<details>
  <summary>🐢 <b>Node.js</b></summary>
  
  ###

  ```bash
  npm i authenticus
  ```

  ```ts
  import { GitHub } from 'authenticus'

  const github = new GitHub({
    clientId: '...',
    clientSecret: '...'
  })

  // #1 - Create a Redirect URL

  const redirectUrl = github.getRedirectUrl({
    scope: ['read:user', 'user:email'], // optional
    allowSignUp: true
  })

  // #2 - Retrieve an Access Token

  const { accessToken } = await github.getAccessToken('<code>')
  // (The code is included in the query string of the callback request.)

  // #3 - Retrieve the User

  const user = await github.getUser(accessToken)
  ```
</details>
