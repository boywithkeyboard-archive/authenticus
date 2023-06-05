## authenticus

### Introduction

> authenticus is an **oauth2 library** with a dozen templates that empower you
> to authenticate users against your app with _almost all major vendors_. It is
> available **for Deno, Node.js, and the browser**. Can't find the provider
> you're looking for?
> [Open an issue!](https://github.com/azurystudio/authenticus/issues/new/choose)

- [ ] `Amazon`
- [ ] `Apple`
- [x] `Discord`
- [ ] `Facebook`
- [x] `GitHub`
- [x] `GitLab`
- [x] `Google`
- [ ] `Instagram`
- [x] `LinkedIn`
- [ ] `Microsoft`
- [x] `Spotify`
- [ ] `Twitter`

### Client

<details open>
  <summary>🦕 <b>Deno</b></summary>

### 

```ts
import { GitHub } from 'https://deno.land/x/authenticus@v0.0.0/mod.ts'

const github = new GitHub({
  clientId: '...',
  clientSecret: '...',
})

// #1 - Create a Authorization URL

const url = github.getAuthorizeUrl({
  client_id: '...',
  redirect_uri: 'https://example.com/oauth2/callback',
  scope: ['read:user', 'user:email'], // optional
  allow_signup: true
})

// #2 - Retrieve an Access Token

const { access_token } = await github.getAccessToken({
  client_id: '...',
  client_secret: '...',
  code: '...', // part of the query string of the callback request
  redirect_uri: 'https://example.com/oauth2/callback'
})

// #3 - Retrieve the User

const user = await github.getUser(access_token)
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

// #1 - Create a Authorization URL

const url = github.getAuthorizeUrl({
  client_id: '...',
  redirect_uri: 'https://example.com/oauth2/callback',
  scope: ['read:user', 'user:email'], // optional
  allow_signup: true
})

// #2 - Retrieve an Access Token

const { access_token } = await github.getAccessToken({
  client_id: '...',
  client_secret: '...',
  code: '...', // part of the query string of the callback request
  redirect_uri: 'https://example.com/oauth2/callback'
})

// #3 - Retrieve the User

const user = await github.getUser(access_token)
```

</details>

### Server

> **Coming soon!** [Join our Discord]() to get notified when it's available!
