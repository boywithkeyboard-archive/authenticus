<div align="center">
  <img src="https://raw.githubusercontent.com/azurystudio/authenticus/dev/.github/assets/logo.svg" width="64px" />
  <h1>authenticus</h1>
</div>

### Introduction

> authenticus is an **oauth2 library** with a dozen templates that empower you
> to authenticate users against your app with _almost all major vendors_. It is
> available **for Deno, Node.js, and the browser (basically anywhere you can run
> JavaScript)**. Can't find the provider you're looking for?
> [Open an issue!](https://github.com/azurystudio/authenticus/issues/new/choose)

- [ ] <img src="https://raw.githubusercontent.com/azurystudio/authenticus/dev/.github/assets/amazon_dark.svg#gh-dark-mode-only" width="16px" /><img src="https://raw.githubusercontent.com/azurystudio/authenticus/dev/.github/assets/amazon_light.svg#gh-light-mode-only" width="16px" /> `Amazon`
- [ ] <img src="https://raw.githubusercontent.com/azurystudio/authenticus/dev/.github/assets/apple.svg" width="16px" /> `Apple`
- [x] <img src="https://raw.githubusercontent.com/azurystudio/authenticus/dev/.github/assets/discord.svg" width="16px" /> `Discord`
- [ ] <img src="https://raw.githubusercontent.com/azurystudio/authenticus/dev/.github/assets/facebook.svg" width="16px" /> `Facebook`
- [x] <img src="https://raw.githubusercontent.com/azurystudio/authenticus/dev/.github/assets/github_dark.svg#gh-dark-mode-only" width="16px" /><img src="https://raw.githubusercontent.com/azurystudio/authenticus/dev/.github/assets/github_light.svg#gh-light-mode-only" width="16px" /> `GitHub`
- [x] <img src="https://raw.githubusercontent.com/azurystudio/authenticus/dev/.github/assets/gitlab.svg" width="16px" /> `GitLab`
- [x] <img src="https://raw.githubusercontent.com/azurystudio/authenticus/dev/.github/assets/google.svg" width="16px" /> `Google`
- [ ] <img src="https://raw.githubusercontent.com/azurystudio/authenticus/dev/.github/assets/instagram.svg" width="16px" /> `Instagram`
- [x] <img src="https://raw.githubusercontent.com/azurystudio/authenticus/dev/.github/assets/linkedin.svg" width="16px" /> `LinkedIn`
- [ ] <img src="https://raw.githubusercontent.com/azurystudio/authenticus/dev/.github/assets/microsoft.svg" width="16px" /> `Microsoft`
- [x] <img src="https://raw.githubusercontent.com/azurystudio/authenticus/dev/.github/assets/spotify.svg" width="16px" /> `Spotify`

### Setup

#### 🦕 Deno

```ts
import { GitHub } from "https://deno.land/x/authenticus@v1.0.0/mod.ts";
```

#### 🐢 Node.js

```bash
npm i authenticus
```

```ts
import { GitHub } from "authenticus";

// CommonJS
const { GitHub } = require("authenticus");
```

### Usage

```ts
// #1 - Create a Authorization URL

const url = GitHub.getAuthorizeUrl({
  client_id: "...",
  scope: ["read:user", "user:email"], // optional
  allow_signup: true,
});

// #2 - Retrieve an Access Token

const { access_token } = await GitHub.getAccessToken({
  client_id: "...",
  client_secret: "...",
  code: "...", // part of the query string of the callback request
  redirect_uri: "https://example.com/oauth2/callback",
});

// #3 - Retrieve the User

const user = await GitHub.getUser(access_token);
```
